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

  public async createPaymentRecord(paymentIntent) {
    let checkExists;
    try {
      checkExists = await this.checkPaymentExists(paymentIntent.id);

      if(!checkExists.exists) {
        const result = query(`INSERT INTO stripe_payments (payment_intent_id, client_secret, subscription_id, campaign_id, amount,
          currency, status) VALUES($1, $2, $3, $4, $5, $6, $7);
          `, [paymentIntent.id, paymentIntent.client_secret, null, paymentIntent.metadata.campaignId, paymentIntent.amount,
              paymentIntent.currency, paymentIntent.status]);
      } else {
        return {
          created: false, 
          error: "Payment record already exists"
        }
      }

      return {
        error: false,
        created: true
      }

    } catch(err) {
      return {error: true, created: false, message: err || "Unknown error"};
    }


  }

  public async updateRecord(paymentIntent) {
    let checkExists;

    try {
      checkExists = this.checkPaymentExists(paymentIntent.id);

      if(checkExists.exists) {
        const result = await query('UPDATE stripe_payments SET status = $1 WHERE payment_intent_id = $2', 
          [paymentIntent.status, paymentIntent.id]
        )
      } else {
        return {
          updated: false,
          error: true, 
        }
      }

      return {
        updated: true,
        error: false
      }

    } catch(error) {
      return {
        error: true,
        message: error || "Unknown error"
      }
    }

  }

}

export default Payments