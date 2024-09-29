import express, {Request, Response} from "express";
import Stripe from 'stripe'; 

import Payments from "../models/Payments";
import Campaigns from "../models/Campaigns";
import Customers from "../models/Customers";
import SessionsModel from "../models/SessionsModel";

import createPayment from "./Payment/createPayment";
import StripeService from "../services/StripeService";
import logger from "../utils/logger";
import SubscriptionsModel from "../models/SubscriptionsModel";

const stripe = new Stripe('sk_test_51PmqG6KG6RDK9K4gSDxcza88uYRyVuFV0LJUQLQyPopCIBxR0rPHbnNu2LHHzf9DO4eqv0kvpNgczOaOOyB7HcKO00qg3j3lTw');

const router = express.Router();


const payments = new Payments();
const campaigns = new Campaigns();
const customers = new Customers();
const sessionsModel = new SessionsModel();
const stripeService = new StripeService();
const subscriptionsModel = new SubscriptionsModel();


router.post('/create', createPayment);

router.get('/confirm', async(req: Request, res: Response) => {
    const {payment_intent, payment_intent_client_secret, redirect_status} = req.query;
    console.log(`Stripe confirm recieved`);
    return res.status(200).json({payment_intent, payment_intent_client_secret, redirect_status});

});

// Define the route handler for POST requests to '/update-payment'


router.post('/update-payment', async (req: Request, res: Response) => {

    // Extract the 'SessionKey' header from the request
    const sessionKey = req.get('SessionKey');

    console.log("sessionKey: ", sessionKey);

    // Extract relevant parameters from the request body
    const {paymentIntentId, amount, status} = req.body;

    // Check if the 'SessionKey' is missing from the request headers
    if(!sessionKey) {
        return res.status(400).json({message: "Missing session key"});
    }

    //Check if 'paymentIntentId' is missing from the request body
    if(!paymentIntentId) {
        return res.status(400).json({message: "Invalid parameters"})
    }
    
    //Check if the user is authenticated
    if(!req.user) { 
        return res.status(401).json({message: "Missing token"});;
    }
    


    try {
        /**
         * check session 
         */

        const sessionExists = await sessionsModel.getSession(sessionKey, 'CONFIRM_PAYMENT');

        /**
         * If session exists and type is pending assume request is duplicate. If it was failed we let it go assuming retry
         */

        if(sessionExists.session && sessionExists.session?.status === 'PENDING') {
            return res.status(409).json({message: "Duplicate request, please restart your session to complete the action."});
        }

        /**
         * if session doesn't exist attempt to add it, under rapid duplicate requests the above
         * check may fail, however unique constraight will stills stop a duplicate
         * during the following insert
         *
         */
        
        const addSessionResult = await sessionsModel.addSession(sessionKey, 'CONFIRM_PAYMENT');

        if(!addSessionResult.created && addSessionResult.error === 'Duplicate') {
            return res.status(409).json({message: "Duplicate request, please restart your session to complete the action."});
        } else if (!addSessionResult.created && addSessionResult.error) {
            throw new Error(addSessionResult.error);
        }

        /**
         * Get the payment intent from stripe service,
         * TODO: we need to check that indeed the payment intent refers to a campaign owned by the user and 
         * possibly that the referenced paymentIntent is the authenticated customers Id
         */
        const getPI = await stripeService.getPaymentIntent(paymentIntentId);

        if(!getPI.paymentIntent || getPI.error) {
            throw new Error(getPI.error || "Could not retrieve paymentIntent");
        }

        /**
         * Get the invoice from the payment intent 
         */
        
        const getInvoice = await stripeService.getInvoice(getPI.paymentIntent.invoice as string);

        if(!getInvoice.invoice || getInvoice.error) {
            throw new Error(getInvoice.error || "Could not retrieve invoice");
        }

        /**
         * Get subscription from the invoice and the pull in the subscription to get the campaign 
         * assoicated with it's meta data
         */
        
        const subscriptionId = getInvoice.invoice.subscription;
        
        const getSubscription = await stripeService.getSubscription(subscriptionId);
        
        if(!getSubscription.subscription || getSubscription.error) {
            throw new Error(getSubscription.error || "Could not retrieve subscription");
        }
        /**
         * After getting the campaignId, update the campaign table and the payments table with the 
         * status of the payment
         */

        const connectedCampaignId = getSubscription.subscription.metadata.campaignId;
        
        const updateCampaignResult = await campaigns.updatePaymentStatus(parseInt(connectedCampaignId), getPI.paymentIntent.status, req.user.email);

        const updatePaymentResult = await payments.updateRecord(getPI.paymentIntent);

        const updateSubscriptionResult = await subscriptionsModel.updateSubscription(getSubscription.subscription.id,
             getSubscription.subscription.status);


        if(!updateCampaignResult.updated || updateSubscriptionResult.error) {
            logger.error(`Error updating campaign: ${updateCampaignResult?.error || updateSubscriptionResult.error 
                ||'Unknown Error'}`);
            throw new Error(`Error updating campaign: ${updateCampaignResult?.error || 'Unknown Error'}`);
        }

        if(!updatePaymentResult.updated) {
            throw new Error(`Error updating payments: ${updatePaymentResult.error} || 'Unknown Error`);
        }
        
        sessionsModel.updateSession(sessionKey, 'COMPLETE', 'CONFIRM_PAYMENT');
        
        return res.status(200).json({updated: updatePaymentResult.updated, success: true, status: getPI.paymentIntent.status,
            campaignConnected: connectedCampaignId});


        
    } catch(error: any) {
        
        sessionsModel.updateSession(sessionKey, 'FAILED', 'CONFIRM_PAYMENT')
        return res.status(500).json({message: `An error occured updating your payment: ${error.message}`});
    }

})

export default router;