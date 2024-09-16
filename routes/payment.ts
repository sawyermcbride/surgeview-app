import express, {Request, Response} from "express";
import Stripe from 'stripe'; 

import Payments from "../models/Payments";
import Campaigns from "../models/Campaigns";
import Customers from "../models/Customers";
import SessionsModel from "../models/SessionsModel";

import createPayment from "./Payment/createPayment";
import StripeService from "../services/StripeService";

const stripe = new Stripe('sk_test_51PmqG6KG6RDK9K4gSDxcza88uYRyVuFV0LJUQLQyPopCIBxR0rPHbnNu2LHHzf9DO4eqv0kvpNgczOaOOyB7HcKO00qg3j3lTw');

const router = express.Router();


const payments = new Payments();
const campaigns = new Campaigns();
const customers = new Customers();
const sessionsModel = new SessionsModel();
const stripeService = new StripeService();



router.post('/create', createPayment);

router.get('/confirm', async(req: Request, res: Response) => {
    const {payment_intent, payment_intent_client_secret, redirect_status} = req.query;
    console.log(`Stripe confirm recieved`);
    return res.status(200).json({payment_intent, payment_intent_client_secret, redirect_status});

});

router.post('/update-payment', async (req: Request, res: Response) => {

    const sessionKey = req.get('SessionKey');
    const {paymentIntentId, amount, status} = req.body;

    if(!sessionKey) {
        return res.status(400).json({message: "Missing session key"});
    }

    if(!paymentIntentId) {
        return res.status(400).json({message: "Invalid parameters"})
    }
    
    
    if(!req.user) {
        return res.status(401).json({message: "Missing token"});;
    }
    

    try {
        /**
         * check session 
         */

        const sessionExists = await sessionsModel.getSession(sessionKey, 'CONFIRM_PAYMENT');

        if(sessionExists.session && sessionExists.session?.status === 'PENDING') {
            return res.status(409).json({message: "Duplicate request, please restart your session to complete the action."});
        }

        /**
         * if session doesn't exist attempt to 
         */
        
        const addSessionResult = await sessionsModel.addSession(sessionKey, 'CONFIRM_PAYMENT');

        if(!addSessionResult.created && addSessionResult.error === 'Duplicate') {
            return res.status(409).json({message: "Duplicate request, please restart your session to complete the action."});
        } else if (!addSessionResult.created && addSessionResult.error) {
            throw new Error(addSessionResult.error);
        }


        const getPI = await stripeService.getPaymentIntent(paymentIntentId);

        if(!getPI.paymentIntent || getPI.error) {
            throw new Error(getPI.error || "Could not retrieve paymentIntent");
        }
        
        const getInvoice = await stripeService.getInvoice(getPI.paymentIntent.invoice as string);

        if(!getInvoice.invoice || getInvoice.error) {
            throw new Error(getInvoice.error || "Could not retrieve invoice");
        }
        
        const subscriptionId = getInvoice.invoice.subscription;
        
        const getSubscription = await stripeService.getSubscription(subscriptionId);
        
        if(!getSubscription.subscription || getSubscription.error) {
            throw new Error(getSubscription.error || "Could not retrieve subscription");
        }

        const connectedCampaignId = getSubscription.subscription.metadata.campaignId;
        
        const updateCampaignResult = await campaigns.updatePaymentStatus(parseInt(connectedCampaignId), getPI.paymentIntent.status, req.user.email);

        const updatePaymentResult = await payments.updateRecord(getPI.paymentIntent);

        if(!updateCampaignResult.updated) {
            throw new Error(`Error updating campaign: ${updateCampaignResult?.error || 'Unknown Error'}`);
        }

        if(!updatePaymentResult.updated) {
            throw new Error(`Error updating payments: ${updatePaymentResult.error} || 'Unknown Error`);
        }


        return res.status(200).json({updated: updatePaymentResult.updated, success: true, status: getPI.paymentIntent.status,
             campaignConnected: connectedCampaignId});
    } catch(error) {
        
        return res.status(500).json({message: `An error occured updating your payment: ${error.message}`});
    }

})

export default router;