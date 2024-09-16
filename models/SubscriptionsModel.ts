//Subscriptions.ts 

import {query} from '../db';
import Subscription from 'stripe';
import {Stripe} from 'stripe';

class SubscriptionsModel {
  /**
   * Gets the subscription by stripe subscription id and stripe customer id
   * @param subscription_id subscription id of the subscription
   * @param customer_id the customer id associated with the subscription
   * @returns {Promise<object>} containing {exists: boolean, internal_customer_id: number}
   */
  public async getSubscription(subscription_id: string, customer_id: string): 
  Promise<{exists: boolean, error: string}> {
    let shouldCreate: boolean = false;

    try {
      const checkExistingSubscriptions = await query(`SELECT * FROM subscriptions WHERE stripe_customer_id = $1 AND
        stripe_subscription = $2`, [subscription_id, customer_id ]);

      if((checkExistingSubscriptions.rowCount ?? 0) === 1) {
        return {exists: true, error: ""}
      } else if(checkExistingSubscriptions.rowCount === 0) {
        return {exists: false, error: ""}
      } else {
        throw new Error('More than one subscription with same id, check table.');
      }

    } catch(error) {
      return {exists: false, error: error.message}
    }

  }

  public async addSubscription(stripe_subscription: Stripe.Subscription, email: string) {
    try {
      await query('BEGIN');

      const result = await query('SELECT id FROM customers WHERE email = $1', [email]);

      if(result.rows.length > 0) {
        
      }
      await query('INSERT INTO subscriptions (stripe_subscription_id, internal_customer_id, start_date, end_date, status_) ')



    } catch(error) {
      return{added: false, error: error.message};
    } 

  }
}

export default SubscriptionsModel;