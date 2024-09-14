
import {jest, describe, expect, test, beforeEach, afterAll} from '@jest/globals';

import  StripeService  from '../StripeService';
import { stripe } from '../../__mocks__/stripe';

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('StripeService', () => {
  let service: StripeService;

  beforeEach(() => {
    service = new StripeService();
  });

  test('createCustomer should return customer id', async () => {
    // Arrange
    const mockCustomerId = 'cus_123';
    (stripe.customers.create as jest.Mock).mockResolvedValue({ id: mockCustomerId } as any);

    // Act
    const customerId = await service.createCustomer('test@example.com');

    // Assert
    expect(customerId).toBe(mockCustomerId);
    expect(stripe.customers.create).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(stripe.customers.create).toHaveBeenCalledTimes(1);
  });

  test('getCustomer should return customer id', async () => {
    // Arrange
    const mockCustomerId = 'cus_123';
    (stripe.customers.retrieve as jest.Mock).mockResolvedValue({ id: mockCustomerId });

    // Act
    const customerId = await service.getCustomer('cus_123');

    // Assert
    expect(customerId).toBe(mockCustomerId);
    expect(stripe.customers.retrieve).toHaveBeenCalledWith('cus_123');
    expect(stripe.customers.retrieve).toHaveBeenCalledTimes(1);
  });

  test('getCustomer should throw error if customer is not found', async () => {
    // Arrange
    const mockError = new Error('Customer not found');
    (stripe.customers.retrieve as jest.Mock).mockRejectedValue(mockError);

    // Act & Assert
    await expect(service.getCustomer('non_existing_id')).rejects.toThrow('Customer not found');
  });

  test('createSubscription should return subscription object', async () => {
    // Arrange
    const mockSubscription = { id: 'sub_123', latest_invoice: { payment_intent: 'pi_123' } };
    (stripe.subscriptions.create as jest.Mock).mockResolvedValue(mockSubscription);

    // Act
    const result = await service.createSubscription('cus_123', 'Standard', 'campaign_123', '12345');

    // Assert
    expect(result.subscription).toEqual(mockSubscription);
    expect(stripe.subscriptions.create).toHaveBeenCalledWith({
      customer: 'cus_123',
      items: [{ price: 'price_1PmqJAKG6RDK9K4gJuajZUyz' }], // Adjust as necessary
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      metadata: { campaignId: 'campaign_123' }
    }, {
      idempotencyKey: '12345'
    });
    expect(stripe.subscriptions.create).toHaveBeenCalledTimes(1);
  });

  test('createSubscription should handle errors', async () => {
    // Arrange
    const mockError = new Error('Subscription creation failed');
    (stripe.subscriptions.create as jest.Mock).mockRejectedValue(mockError);

    // Act & Assert
    await expect(service.createSubscription('cus_123', 'basic_plan', 'campaign_123', '12345')).rejects.toThrow('Subscription creation failed');
  });
});