

import Stripe from "stripe";

const stripe = new Stripe('sk_test_51PmqG6KG6RDK9K4gSDxcza88uYRyVuFV0LJUQLQyPopCIBxR0rPHbnNu2LHHzf9DO4eqv0kvpNgczOaOOyB7HcKO00qg3j3lTw');


class StripeService {

  public stripePriceIds: Object = {
    'Standard': "price_1PmqJAKG6RDK9K4gJuajZUyz",
    'Premium': "price_1PmqJhKG6RDK9K4gEnz3SyEF",
    'Pro': "price_1PmqK6KG6RDK9K4glwCiv8SP",
    'ProMax': "price_1PvAqZKG6RDK9K4gtaRYZtle",
    "Enterprise": "test"
  }

  public async createCustomer(email: string):Promise<{customer?: any, error: string | null}> {
    try {
      const customer = await stripe.customers.create({email});
      return { customer, error: null}
    } catch(error) {
      return {customer: null, error: error.message }
    }
    
  }
  /**
   * Get the customer id or throws error if doesn't exist
   * @param {string} customer_id 
   * @returns {Promise<string>} 
   * @throws {Error} if customer is not found
   */
  public async getCustomer(customer_id: string): Promise<{customer?: any, error: string | null}> {
    try {
      const result = await stripe.customers.retrieve(customer_id);
      
      return {customer: result, error: null};

    } catch(error) {
      return {customer: null, error: error.message};
    }
  }

  public async createSubscription(customer_id:string, plan_name: string, campaignId: string, sessionKey: string, paymentMethodId: string): 
  Promise<{subscription?: any, error: string | null}> {

    
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customer_id,
        items:[{price: this.stripePriceIds[plan_name]}],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
        default_payment_method: paymentMethodId,
        metadata: {
            campaignId
        }

      }, {
        idempotencyKey: sessionKey
      });

      return {subscription, error: null};
      
    } catch(error) {
      
      return {error: error.message, subscription: null};
    }
    
  }

  /**
   * Gets paymentIntent by id using Stripe SDK
   * @param paymentIntentId id of the payment intent
   * @returns Promise<{error: string | null, paymentIntent?: any}>
   */

  public async getPaymentIntent(paymentIntentId: string): Promise<{error: string | null, paymentIntent?: any}> {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        return {error: null, paymentIntent}

      } catch(error) {
        return {error: error.message || "Failed to get paymentIntent", paymentIntent: null}
      }
      
  }
  /**
   * Gets invoice by invoice id using Stripe SDK
   * @param id string of invoice id
   * @returns Promise<{error: string | null, invoice?: any}>  error is null if none
   */
  public async getInvoice(id: string): Promise<{error: string | null, invoice?: any}> {
    try {
      const invoice = await stripe.invoices.retrieve(id);

      return {error: null, invoice};
    } catch(error) {
      return {error: error.message || "Failed to get invoice", invoice: null};
    }
    
  }

  public async getSubscription(id: string): Promise<{error: string | null, subscription?: any}> {
    try {
      const subscription = await stripe.subscriptions.retrieve(id);

      return {error: null, subscription}
    } catch(error) {
      return {error: error.message || "Failed to get subscription", subscription: null};
    }
  }


}

export default StripeService;