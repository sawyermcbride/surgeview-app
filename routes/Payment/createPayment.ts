
//createPayment route 

import { Request, Response } from "express";
import Campaigns from "../../models/Campaigns";
import SessionsModel from "../../models/SessionsModel";
import Customers from "../../models/Customers";
import StripeService from '../../services/StripeService';
import Payments from "../../models/Payments";



const campaigns = new Campaigns();
const sessionsModel = new SessionsModel();
const customers = new Customers();
const stripeService = new StripeService();
const payments = new Payments();


async function getOrCreateStripeCustomer(email: string): Promise<string> {
  async function createAndSaveCustomer(email: string): Promise<string> {
      const createResult = await stripeService.createCustomer(email);
      if(createResult.error) {
        throw new Error(createResult.error);
      }

      const saveResult = await customers.setStripeId(email, createResult.customer.id);
      if(saveResult.error) {
        throw new Error("Error saving customer data");
      }

      return createResult.customer.id;
  }

  // check if id exists in database 
  const checkCustomerId = await customers.getStripeId(email);
  //This if stateemnt is reading empty string from above function and leading to it skipped over 
  //and returning ""
  

    try {
        if(!(checkCustomerId.customer_id)) {
            throw new Error('NoRecord');
        }
        //verify the customer exists in stripe
        const customerId = checkCustomerId.customer_id;
        const checkCustomerResult = await stripeService.getCustomer(customerId);

        if(!checkCustomerResult.customer) {
            throw new Error('NoRecord');
        }

        return customerId; // if stripe has the customer then return id

    } catch(error: any) {
        if(error.type === 'StripeInvalidResponseError' || error.message === 'NoRecord' ) {
            return await createAndSaveCustomer(email);
        } else {
            throw error;
        }
    }


}


export default async function (req: Request, res: Response,) {

  const sessionKey = req.get('SessionKey');
  const valid_plans = Object.keys(stripeService.stripePriceIds);

  try {
    

      const {plan_name, amount, paymentMethodId, campaignId} = req.body;
      
      if(isNaN(campaignId) || !plan_name || !valid_plans.includes(plan_name) ) {
        return res.status(400).json({message: "Invalid parameters"})
      }

      const campaignExistsResult = await campaigns.checkExists(campaignId);
      

      if(!req.user?.email ) {
          return res.status(401).json({message: "Missing or invalid token"});
      }
      
      if(!sessionKey) {
          return res.status(400).json({message: "Missing session key"});
      }
      
      if(campaignExistsResult.error) {
          
          return res.status(500).json({ message: "Internal server error. Please try again later." });
      }
      if(!campaignExistsResult.exists) {
          return res.status(400).json({messsage: "Campaign not found, unable to create payment."});
      }
        if(isNaN(campaignId)) {
            return res.status(400).json({message: "Invalid campaignId"})
        }
      
        const customerHasAccess = await customers.checkCampaignBelongs(req.user.email, parseInt(campaignId));
        const sessionExists = await sessionsModel.getSession(sessionKey, 'CREATE_PAYMENT');
        if(!customerHasAccess) {
            return res.status(401).json({message: "Cannot create payment, user unable access the requested campaign"});
        }

        if(sessionExists.session) {
            //Attempt to return existing clientSecret 
            const currentPayment = await payments.getPaymentByCampaign(campaignId);
            if(currentPayment.payments && currentPayment.payments[0]) {
                return res.status(200).json({clientSecret: currentPayment.payments[0].client_secret});
            } else {
                return res.status(409).json({message: "Duplicate request, please restart your session to complete the action."});
            }

        }
        
        
        /**
        * Attempt to create session
        */
      
        const addSessionResult = await sessionsModel.addSession(sessionKey, 'CREATE_PAYMENT');

        if(!addSessionResult.created && addSessionResult.error === 'Duplicate') {
            return res.status(409).json({message: "Duplicate request, please restart your session to complete the action."});
        }

      let customer_id;
      try {
          customer_id = await getOrCreateStripeCustomer(req.user.email);

      } catch(error) {
          return res.status(500).json({error});
      }   

      
      let createdSubscription = await stripeService.createSubscription(customer_id, plan_name, campaignId, sessionKey, paymentMethodId);

      if(createdSubscription.error) {
        throw new Error(createdSubscription.error);
      }
    



      const paymentIntent = createdSubscription.subscription.latest_invoice.payment_intent; 
      const paymentRecordResult = await payments.createPaymentRecord(paymentIntent, createdSubscription.subscription);

      if(paymentRecordResult.created && !paymentRecordResult.error) {
        
        const updatedSession = await sessionsModel.updateSession(sessionKey, 'COMPLETE', 'CONFIRM_PAYMENT');
        if(updatedSession.error || !updatedSession.updated) {
          return res.status(500).json({message: "Could not update session"});
        }
        
        return res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });

      } else {
          if(paymentRecordResult.error && paymentRecordResult.error.includes('Duplicate')) {
              return res.status(409).json({message: "Duplicate record. Please wait and try again"});
          } else {

              return res.status(500).json({error: paymentRecordResult.error});
          }
      }

  } catch(err: any) {
        if(sessionKey) {
            sessionsModel.updateSession(sessionKey, 'FAILED', 'CREATE_PAYMENT');
        }


        console.log('createPayment: End catch error: ', err.message);
        console.log('createPayment: End catch full error: ', err.message);
        return res.status(500).json({error: err.message});
  }
}