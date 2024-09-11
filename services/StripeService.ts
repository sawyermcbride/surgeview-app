

import Stripe from "stripe";

const stripe = new Stripe('sk_test_51PmqG6KG6RDK9K4gSDxcza88uYRyVuFV0LJUQLQyPopCIBxR0rPHbnNu2LHHzf9DO4eqv0kvpNgczOaOOyB7HcKO00qg3j3lTw');

const stripePriceIds = {
  'Standard': "price_1PmqJAKG6RDK9K4gJuajZUyz",
  'Premium': "price_1PmqJhKG6RDK9K4gEnz3SyEF",
  'Pro': "price_1PmqK6KG6RDK9K4glwCiv8SP",
  'Pro Max': "price_1PvAqZKG6RDK9K4gtaRYZtle"
}

class StripeService {

  public async createCustomer(email: string):Promise<string> {
    const customer = await stripe.customers.create({email});
    return customer.id;
  }
  /**
   * Get the customer id or throws error if doesn't exist
   * @param {string} customer_id 
   * @returns {Promise<string>} 
   * @throws {Error} if customer is not found
   */
  public async getCustomer(customer_id: string): Promise<string> {
    try {
      const result = await stripe.customers.retrieve(customer_id);
      return result.id;

    } catch(error) {
      throw error;
    }
  }

  public async createSubscription(customer_id:string, plan_name: string, campaignId: string): 
  Promise<{subscription: Stripe.Subscription | null}> {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customer_id,
        items:[{price: stripePriceIds[plan_name]}],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
        metadata: {
            campaignId
        }

      })
      return {subscription};
      
    } catch(error) {
      throw error;
    }
    
  }
}

export default StripeService;