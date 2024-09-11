import express, {Request, Response} from "express";
import Stripe from 'stripe'; 

import Payments from "../models/Payments";
import Campaigns from "../models/Campaigns";
import Customers from "../models/Customers";
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

const stripePriceIds = {
    'Standard': "price_1PmqJAKG6RDK9K4gJuajZUyz",
    'Premium': "price_1PmqJhKG6RDK9K4gEnz3SyEF",
    'Pro': "price_1PmqK6KG6RDK9K4glwCiv8SP",
    'Pro Max': "price_1PvAqZKG6RDK9K4gtaRYZtle"
}
  

async function getOrCreateStripeCustomer(email: string): Promise<string> {
    async function createAndSaveCustomer(email: string): Promise<string> {
        const customer = await stripe.customers.create({email});

        const saveResult = await customers.setStripeId(email, customer.id);

        return customer.id;
    }

    // check if id exists in database 
    const checkCustomerId = await customers.getStripeId(email);
    if(checkCustomerId?.customer_id) {
        try {
            //verify the customer exists in stripe
            const customerId = checkCustomerId.customer_id;
            await stripe.customers.retrieve(customerId);

            return customerId; // if stripe has the customer then return id

        } catch(error) {
            if(error.type = 'StripeInvalidResponseError') {
                return await createAndSaveCustomer(email);
            } else {
                throw error;
            }
        }
    }

    return "";

}


router.post('/create', async (req: Request, res: Response,) => {
    try {
        const {plan_name, amount, paymentMethodId, campaignId} = req.body;

        const campaignExistsResult = await campaigns.checkExists(campaignId);
        
        
        if(!req.user.email) {
            return res.status(401);
        }
        
        
        if(campaignExistsResult.error) {
            console.error(campaignExistsResult.errorMessage);
            return res.status(500).json({ message: "Internal server error. Please try again later." });
        }
        
        if(!campaignExistsResult.exists) {
            return res.status(400).json({messsage: "Campaign not found, unable to create payment."});
        }
        
        const customerHasAccess = await customers.checkCampaignBelongs(req.user.email, campaignId);

        if(!customerHasAccess) {
            return res.status(400).json({message: "Cannot create payment, user unable access the requested campaign"});
        }

        let customer_id;
        try {
            customer_id = await getOrCreateStripeCustomer(req.user.email);

        } catch(error) {
            return res.status(500).json({error});
        }


        let priceId = stripePriceIds[req.body.plan_name] || "";

        const subscription = await stripe.subscriptions.create({
            customer: customer_id,
            items:[{price: priceId}],
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
            metadata: {
                campaignId
            }
        })

        const paymentIntent = subscription.latest_invoice.payment_intent; 


        const paymentRecordResult = await payments.createPaymentRecord(paymentIntent, subscription);

        if(paymentRecordResult.created && !paymentRecordResult.error) {
            return res.status(200).send({
                clientSecret: paymentIntent.client_secret,
            })
        } else {
            if(paymentRecordResult.error && paymentRecordResult.message.includes('Duplicate')) {
                return res.status(409).json({message: "Duplicate record. Please wait and try again"});
            } else {
                return res.status(500).json({error: paymentRecordResult.message});
            }
        }

    } catch(err) {
        return res.status(500).send({error: err.message});
    }
});

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