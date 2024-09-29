
//createPayment route 

import { Request, Response } from "express";
import Campaigns from "../../models/Campaigns";
import SessionsModel from "../../models/SessionsModel";
import Customers from "../../models/Customers";
import StripeService from '../../services/StripeService';
import Payments from "../../models/Payments";
import logger from "../../utils/logger";
import SubscriptionsModel from "../../models/SubscriptionsModel";

const campaigns = new Campaigns();
const sessionsModel = new SessionsModel();
const customers = new Customers();
const stripeService = new StripeService();
const payments = new Payments();
const subscriptionsModel = new SubscriptionsModel();


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

      logger.info('createPayment: ', {plan_name, amount, paymentMethodId, campaignId, sessionKey});
      
      if(!campaignId || isNaN(campaignId) || !plan_name || 
        !valid_plans.includes(plan_name)) {

        logger.error('Invalid parameters');
        return res.status(400).json({message: "Invalid parameters"})
      }

      const campaignExistsResult = await campaigns.checkExists(campaignId);
      

      if(!req.user?.email ) {
          return res.status(401).json({message: "Missing or invalid token"});
      }
      
      if(!sessionKey) {
        logger.error('Missing session key');
          return res.status(400).json({message: "Missing session key"});
      }
      
      if(campaignExistsResult.error) {
          logger.error('Error checking if campaign exists: ', campaignExistsResult.error);

          return res.status(500).json({ message: "Internal server error. Please try again later." });
      }
      if(!campaignExistsResult.exists) {
        logger.warn('Campaign not found, unable to create payment.');
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
            logger.info('Session exists, duplicate request, not creating payment');
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
            logger.warn('Attempted to create session failed, returning 200 with existing key if found');
            
            //Attempt to return existing clientSecret

            const currentPayment = await payments.getPaymentByCampaign(campaignId);

            if(currentPayment.payments && currentPayment.payments[0]) {
                return res.status(200).json({clientSecret: currentPayment.payments[0].client_secret});
            } else {
                return res.status(409).json({message: "Duplicate request, please restart your session to complete the action."});
            }
                      
        }

      let customer_id;
      try {
          customer_id = await getOrCreateStripeCustomer(req.user.email);

      } catch(error) {
        logger.error('Error creating customer: ', (error as any).message);

        return res.status(500).json({error});
      }   

      
      let createdSubscription = await stripeService.createSubscription(customer_id, plan_name, campaignId, sessionKey, paymentMethodId);

      if(createdSubscription.error) {
        logger.error('Error creating subscription: ', createdSubscription.error);
        throw new Error(createdSubscription.error);
      }
    



      const paymentIntent = createdSubscription.subscription.latest_invoice.payment_intent; 
      const paymentRecordResult = await payments.createPaymentRecord(paymentIntent, createdSubscription.subscription);
      const createSubscriptionResult = await subscriptionsModel.addSubscription(createdSubscription.subscription, req.user.email);

      if(paymentRecordResult.created && !paymentRecordResult.error && createSubscriptionResult.added
        && !createSubscriptionResult.error) {
            
        logger.info('Payment record created');
        const updatedSession = await sessionsModel.updateSession(sessionKey, 'COMPLETE', 'CREATE_PAYMENT');

        
        if(updatedSession.error || !updatedSession.updated) {
            
            logger.error('Could not update session');
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


        logger.error('Error creating payment: ', err.message);
        return res.status(500).json({error: err.message});
  }
}