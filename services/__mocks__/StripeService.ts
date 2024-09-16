
import { jest } from "@jest/globals";

const createSubscription = jest.fn();
const createCustomer = jest.fn();
const getCustomer = jest.fn();
const getPaymentIntent = jest.fn();
const getInvoice = jest.fn();
const getSubscription = jest.fn();

const stripePriceIds = {
  'Standard': "price_1PmqJAKG6RDK9K4gJuajZUyz",
  'Premium': "price_1PmqJhKG6RDK9K4gEnz3SyEF",
  'Pro': "price_1PmqK6KG6RDK9K4glwCiv8SP",
  'ProMax': "price_1PvAqZKG6RDK9K4gtaRYZtle"
}


class StripeService {
  stripePriceIds = stripePriceIds;
  createSubscription = createSubscription;
  createCustomer = createCustomer;
  getCustomer = getCustomer;
  getPaymentIntent = getPaymentIntent;
  getInvoice = getInvoice;
  getSubscription = getSubscription;
}

export default StripeService;