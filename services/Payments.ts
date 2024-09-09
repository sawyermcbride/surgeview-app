//Payment.ts

import { PaymentIntent } from '@stripe/stripe-js';
import {query} from '../db';
import Stripe from 'stripe'; 

const stripe = new Stripe('sk_test_51PmqG6KG6RDK9K4gSDxcza88uYRyVuFV0LJUQLQyPopCIBxR0rPHbnNu2LHHzf9DO4eqv0kvpNgczOaOOyB7HcKO00qg3j3lTw');

class Payments {
  private async checkPaymentExists(paymentIntentId: string) {
    if(!paymentIntentId) {
      throw new Error("Missing paymenIntentId");
    }
    try {
      const result = await query(`SELECT id, payment_intent_id, campaign_id, status FROM stripe_payments
                           WHERE payment_intent_id = $1`, [paymentIntentId]);
      if(result.rows.length === 0) {
        return {exists: false}
      } else {
        return {
          exists: true,
          result: result.rows
        }
      }
      
    } catch(err) {
      throw new Error(err);
    }
  }

  public async checkPaymentExistsByCampaign(campaignId: number) {
    if(!campaignId) {
      throw new Error("Missing campaign ID, cannot lookup payment record");
    }

    await query('BEGIN');

    const result = await query(`SELECT * FROM stripe_payments WHERE campaign_id = $1 AND 
                                created_at > NOW() - INTERVAL '1 minute' FOR UPDATE`, [campaignId]);

    console.log(`Reaslt from query, number of rows = ${result.rows.length}`);

    if(result.rows.length > 0) {

      await query('ROLLBACK');

      return {
        exists: true, 
        payments: result.rows
      }
    } else {
      await query('COMMIT');
      return {
        exists: false
      }
    }

  }

  public async createPaymentRecord(paymentIntent, subscription) {
    let checkExists;
    try {
      await query('BEGIN');

      /**
       * Duplicate payment_intent_id and duplicate campaign_id entries (within same minute) are 
       * handled with unique constraints on table
       */

      const result = await query(`INSERT INTO stripe_payments (payment_intent_id, client_secret, subscription_id, campaign_id, amount,
        currency, status, truncated_created_at) VALUES($1, $2, $3, $4, $5, $6, $7, DATE_TRUNC('minute', NOW()));
        `, [paymentIntent.id, paymentIntent.client_secret, null, paymentIntent.metadata.campaignId, paymentIntent.amount,
            paymentIntent.currency, paymentIntent.status]);

      await query('COMMIT');
              
      return {
        error: false,
        created: true,
        message: result
      }

    } catch(err) {
      console.log('Error in creating payment record');
      await query('ROLLBACK');
      
      if (err.code === '23505') { // PostgreSQL unique violation error code
        return {
            error: true,
            created: false,
            message: "Duplicate payment record"
        };
      }
      console.log(err);
      return {error: true, created: false, message: err || "Unknown error"};
    }


  }

  public async updateRecord(paymentIntent) {

    console.log(paymentIntent);

    try {    
      console.log('Updating record');
      await query('BEGIN');
      const result = await query('UPDATE stripe_payments SET status = $1 WHERE payment_intent_id = $2', 
        [paymentIntent.status, paymentIntent.id]
      )
      
      await query('COMMIT');

      return {
        updated: true,
        error: false
      }

    } catch(error) {
      await query('ROLLBACK');
      return {
        error: true,
        message: error || "Unknown error"
      }
    }

  }

}

export default Payments