import express, {Request, Response} from "express";
import Stripe from 'stripe'; 

const stripe = new Stripe('sk_test_51PmqG6KG6RDK9K4gSDxcza88uYRyVuFV0LJUQLQyPopCIBxR0rPHbnNu2LHHzf9DO4eqv0kvpNgczOaOOyB7HcKO00qg3j3lTw');

const router = express.Router();
/**
 * http://10.0.0.47:5173/dashboard
 * ?payment_intent=pi_3PvEa5KG6RDK9K4g1YATYpG2&payment_intent_client_secret=pi_3PvEa5KG6RDK9K4g1YATYpG2_secret_CEtDF8DAhArxEPU9kEObtH2Vj
 * &redirect_status=succeeded
 */

router.post('/create', async (req: Request, res: Response,) => {
    try {
        const {amount, paymentMethodId, campaignDetails} = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        })
    } catch(err) {
        res.status(500).send({error: err.message});
    }
});

router.post('/confirm', async(req: Request, res: Response) => {
    const {payment_intent, payment_intent_client_secret, redirect_status} = req.query;
});

export default router;