
import {jest, describe, expect, test, beforeEach, afterAll} from '@jest/globals';

import  StripeService  from '../StripeService';
import Stripe from 'stripe';



jest.mock('stripe');

// Reset all mocks before each test
beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});



const mockedStripe = new Stripe('123456') as jest.Mocked<Stripe>;


describe('StripeService', () => {
  let service: StripeService;

  beforeEach(() => {
    service = new StripeService();
    jest.clearAllMocks();
  });

  test('createCustomer should return customer id', async () => {
    // Arrange
    const mockCustomerId = 'cus_123';
    (mockedStripe.customers.create).mockResolvedValue({ id: mockCustomerId } as any);

    // Act
    const customerId = await service.createCustomer('test@example.com');

    // Assert
    expect(customerId).toEqual({customer: {id: "cus_123"}, error: null});
    expect(mockedStripe.customers.create).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockedStripe.customers.create).toHaveBeenCalledTimes(1);
  });

  test('getCustomer should return customer id', async () => {
    // Arrange
    const mockCustomerId = 'cus_123';
    (mockedStripe.customers.retrieve).mockResolvedValueOnce({id: mockCustomerId });

    // Act
    const customerId = await service.getCustomer('cus_123');

    // Assert
    expect(customerId).toEqual({customer: {id: "cus_123"}, error: null});
    expect(mockedStripe.customers.retrieve).toHaveBeenCalledWith('cus_123');
    expect(mockedStripe.customers.retrieve).toHaveBeenCalledTimes(1);
  });

  test('getCustomer should return error if customer is not found', async () => {
    // Arrange
    const mockError = new Error('Customer not found');
    (mockedStripe.customers.retrieve).mockRejectedValue(mockError);

    // Act & Assert
    const result = await service.getCustomer('non_existing_id');

    expect(result).toEqual( {"customer": null, "error": 'Customer not found'});
  });

  test('createSubscription should return subscription object', async () => {
    // Arrange
    const mockSubscription = { id: 'sub_123', latest_invoice: { payment_intent: 'pi_123' } };
    (mockedStripe.subscriptions.create).mockResolvedValueOnce(mockSubscription);

    // Act
    const result = await service.createSubscription('cus_123', 'Standard', 'campaign_123', '12345', 'pm_123456');
    console.log("Result in createSubscription test", result);
    // Assert
    expect(result).toEqual({error: null, subscription: mockSubscription});
    expect(mockedStripe.subscriptions.create).toHaveBeenCalledWith({
      customer: 'cus_123',
      items: [{ price: 'price_1PmqJAKG6RDK9K4gJuajZUyz' }], // Adjust as necessary
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      default_payment_method: 'pm_123456',
      metadata: { campaignId: 'campaign_123' }
    }, {
      idempotencyKey: '12345'
    });
    expect(mockedStripe.subscriptions.create).toHaveBeenCalledTimes(1);
  });

  test('createSubscription should handle errors', async () => {
    // Arrange
    const mockError = new Error('Subscription creation failed');
    (mockedStripe.subscriptions.create).mockRejectedValue(mockError);

    // Act & Assert
    const result = await service.createSubscription('cus_123', 'basic_plan', 'campaign_123', '12345', '123456');

    expect(result).toEqual({error: "Subscription creation failed", subscription: null});
  });

  test('getPaymentIntent calls correct stripe function', async() => {

    (mockedStripe.paymentIntents.retrieve).mockResolvedValue({paymentIntent: 1});

    
    const result = await service.getPaymentIntent('pi_123456789');
    expect(result.error).toBeFalsy();
    expect(result.paymentIntent).toBeTruthy();

    expect(mockedStripe.paymentIntents.retrieve).toHaveBeenCalledTimes(1);
  });

  test('getInvoice calls correct stripe function', async() => {
    (mockedStripe.invoices.retrieve).mockResolvedValue({id: '123456'});

    const result = await service.getInvoice('123456');

    expect(result.error).toBeFalsy();
    expect(result.invoice).toBeTruthy();

    expect(mockedStripe.invoices.retrieve).toHaveBeenNthCalledWith(1, '123456');
  })

  test('getSubscription calls correct stripe function', async() => {
    (mockedStripe.subscriptions.retrieve).mockResolvedValueOnce({id:'123456'});

    const result = await service.getSubscription('123456');

    expect(result.error).toBeFalsy();
    expect(result.subscription).toBeTruthy();

    expect(mockedStripe.subscriptions.retrieve).toHaveBeenNthCalledWith(1, '123456');
  });

  test('getSubscription handles error', async() => {
    (mockedStripe.subscriptions.retrieve).mockRejectedValueOnce({message:'Subscription error'});

    
    const result = await service.getSubscription('123456');

    expect(result.error).toBeTruthy();
    expect(result.subscription).toBeFalsy();

    expect(mockedStripe.subscriptions.retrieve).toHaveBeenNthCalledWith(1, '123456');

    expect(result.error).toEqual('Subscription error');

  });

  test('getSubscription paymentIntent error', async() => {
    (mockedStripe.paymentIntents.retrieve).mockRejectedValueOnce({message:'Payment intent error'});

    
    const result = await service.getPaymentIntent('123456');

    expect(result.error).toBeTruthy();
    expect(result.paymentIntent).toBeFalsy();

    expect(mockedStripe.paymentIntents.retrieve).toHaveBeenNthCalledWith(1, '123456');

    expect(result.error).toEqual('Payment intent error');
  });

  test('getInvoice handles error', async() => {
    (mockedStripe.invoices.retrieve).mockRejectedValueOnce({message: "Invoice error"});

    const result = await service.getInvoice('123456');

    expect(result.error).toBeTruthy();
    expect(result.invoice).toBeFalsy();

    expect(mockedStripe.invoices.retrieve).toHaveBeenNthCalledWith(1, '123456');

    expect(result.error).toEqual('Invoice error');
  })

});