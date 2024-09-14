import express, {Request, Response} from "express";
import Stripe from 'stripe'; 

import Payments from "../models/Payments";
import Campaigns from "../models/Campaigns";
import Customers from "../models/Customers";
import SessionsModel from "../models/SessionsModel";

import createPayment from "./Payment/createPayment";

const stripe = new Stripe('sk_test_51PmqG6KG6RDK9K4gSDxcza88uYRyVuFV0LJUQLQyPopCIBxR0rPHbnNu2LHHzf9DO4eqv0kvpNgczOaOOyB7HcKO00qg3j3lTw');

const router = express.Router();
/**
 * http://10.0.0.47:5173/dashboard
 * ?payment_intent=pi_3PvEa5KG6RDK9K4g1YATYpG2&payment_intent_client_secret=pi_3PvEa5KG6RDK9K4g1YATYpG2_secret_CEtDF8DAhArxEPU9kEObtH2Vj
 * &redirect_status=succeeded
 */

const payments = new Payments();
const campaigns = new Campaigns();
const customers = new Customers();
const sessionsModel = new SessionsModel();

const stripePriceIds = {
    'Standard': "price_1PmqJAKG6RDK9K4gJuajZUyz",
    'Premium': "price_1PmqJhKG6RDK9K4gEnz3SyEF", 
    'Pro': "price_1PmqK6KG6RDK9K4glwCiv8SP",
    'Pro Max': "price_1PvAqZKG6RDK9K4gtaRYZtle"
}
  


router.post('/create', createPayment);

router.get('/confirm', async(req: Request, res: Response) => {
    const {payment_intent, payment_intent_client_secret, redirect_status} = req.query;
    console.log(`Stripe confirm recieved`);
    return res.status(200).json({payment_intent, payment_intent_client_secret, redirect_status});

});

router.post('/update-payment', async (req: Request, res: Response) => {
    const {paymentIntentId, amount, status} = req.body;

    if(!req.user) {
        return res.status(401);
    }

    try {

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        const invoice = await stripe.invoices.retrieve(paymentIntent.invoice);

        const subscriptionId = invoice.subscription;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        const connectedCampaignId = subscription.metadata.campaignId;


        // await query(`UPDATE campaigns SET payment_status = $1 FROM customers WHERE
        //             campaigns.customer_id = customers.id AND campaigns.campaign_id = $2 AND 
        //             customers.email = $3;`, [paymentIntent.status, connectedCampaignId, req.user.email]);  
        console.log(`Updating campaignId : ${connectedCampaignId}`)
        
        const updateCampaignResult = await campaigns.updatePaymentStatus(parseInt(connectedCampaignId), paymentIntent.status, req.user.email);

        const updatePaymentResult = await payments.updateRecord(paymentIntent);

        if(!updateCampaignResult.updated) {
            throw new Error(`Error updating campaign: ${updateCampaignResult?.error || 'Unknown Error'}`);
        }

        if(!updatePaymentResult.updated) {
            throw new Error(`Error updating payments: ${updatePaymentResult.error} || 'Unknown Error`);
        }
        
        return res.status(200).json({updated: updatePaymentResult.updated, success: true, status: paymentIntent.status,
             campaignConnected: connectedCampaignId});
    } catch(error) {
        console.log(error);
        return res.status(500).json({message: "An error occured updating your payment", error});
    }

})

export default router;