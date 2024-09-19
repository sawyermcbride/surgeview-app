//Payments.ts

import { PaymentIntent } from '@stripe/stripe-js';
import {query} from '../db';
import Stripe from 'stripe'; 

const stripe = new Stripe('sk_test_51PmqG6KG6RDK9K4gSDxcza88uYRyVuFV0LJUQLQyPopCIBxR0rPHbnNu2LHHzf9DO4eqv0kvpNgczOaOOyB7HcKO00qg3j3lTw');

class Payments {

  /**
   * Checks if a payment exists for the campaign
   * @param campaignId 
   * @returns {exists: boolean, error: string | null, payments: any //records}
   */
  public async getPaymentByCampaign(campaignId: number): Promise<{exists: boolean, error: string | null, payments: any | null}> {
    if(!campaignId) {
      return { exists: true,  error: null, payments: null };
    }
    try {
      const result = await query(`SELECT * FROM stripe_payments WHERE campaign_id = $1`,
      [campaignId]);
  
      if(result.rows.length > 0) {
        return {
          exists: true, 
          error: null,
          payments: result.rows
        }
      } else {
        return {
          exists: false,
          error: null,
          payments: null
        };
      }

    } catch(error) {
      return {
        exists: false,
        error: error.message || "Other error",
        payments: null
      };
    }


  }
  /**
   * 
   * @param {PaymentIntent} paymentIntent the payment intent for the associated subscription
   * @param subscription 
   * @returns {Object} {error: boolean, created: boolean, message: empty string if no error };
   */

  public async createPaymentRecord(paymentIntent: any, subscription: any): Promise<{created: boolean, error: string | null}> {
    let checkExists;
    try {
      await query('BEGIN');

      const result = await query(`INSERT INTO stripe_payments (payment_intent_id, client_secret, subscription_id, campaign_id, amount,
        currency, status, stripe_customer_id, truncated_created_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, DATE_TRUNC('minute', NOW()));
        `, [paymentIntent.id, paymentIntent.client_secret, subscription.id, subscription.metadata.campaignId, paymentIntent.amount,
            paymentIntent.currency, paymentIntent.status, subscription.customer]);

      await query('COMMIT');
              
      return {
        error: null,
        created: true,
      }

    } catch(err) {
      
      console.log('Error in creating payment record');
      console.log('Error Code:', err?.code);
      console.log('Error Message:', err?.message);
      await query('ROLLBACK');
      
      
      if (err?.code === '23505') { // PostgreSQL unique violation error code
        return {
            error: "Duplicate payment record",
            created: false,
        };
      }
      console.log(err);
      return {error: err?.message || "Unknown error", created: false};
    }


  }

  public async updateRecord(paymentIntent: any): Promise<{updated: boolean, error: string | null}> {

    try {    
   
      await query('BEGIN');
      const result = await query('UPDATE stripe_payments SET status = $1 WHERE payment_intent_id = $2', 
        [paymentIntent.status, paymentIntent.id]
      );
      
      await query('COMMIT');

      return {
        updated: true,
        error: null
      }

    } catch(error) {
      await query('ROLLBACK');
      return {
        updated: false,
        error: error.message,
      }
    }

  }

}

export default Payments