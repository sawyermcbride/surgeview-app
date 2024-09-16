
import { jest } from '@jest/globals';

interface CreateCustomerResponse {
  id: string;
}
export const stripe = {
  customers: {
    create: jest.fn<() => Promise<CreateCustomerResponse>>(),
    retrieve: jest.fn<() => Promise<CreateCustomerResponse>>()
  },
  subscriptions: {
    create: jest.fn<() => Promise<any>>(),
    retrieve: jest.fn<() => Promise<CreateCustomerResponse>>()
  },
  paymentIntents: {
    retrieve: jest.fn<() => Promise<CreateCustomerResponse>>()
  },
  invoices: {
    retrieve: jest.fn<() => Promise<CreateCustomerResponse>>()
  }
};

export default class Stripe {
  public customers = stripe.customers;
  public subscriptions = stripe.subscriptions;
  public paymentIntents = stripe.paymentIntents;
  public invoices = stripe.invoices;
  
  constructor(secret: string) {
    // You can check the secret or throw an error if it's incorrect
  }
}
