//Payments.ts tests

import {jest, describe, test, beforeEach, expect} from '@jest/globals';
import {query} from '../../db';

import Payments from '../Payments';

jest.mock('../../db');


const queryMock = query as jest.Mock;


describe('Payments Model tests: ', () => {
  let payments: Payments;

  beforeEach(() => {
    payments = new Payments();
    jest.clearAllMocks();
  });

  test('getPaymentByCampaign handles query error ', async() => {
    queryMock.mockRejectedValueOnce({message: "query error"});
    const result = await payments.getPaymentByCampaign(50);

    expect(result).toEqual({
      exists: false,
      error: "query error",
      payments: null
    });

    expect(queryMock).toHaveBeenNthCalledWith(1, `SELECT * FROM stripe_payments WHERE campaign_id = $1`, [50]);
    
  });

  test('getPaymentByCampaign handles case for  row found', async() => {
    queryMock.mockResolvedValueOnce({rows: [{id: 6}]});
    const result = await payments.getPaymentByCampaign(50);

    expect(result).toEqual({
      exists: true,
      error: null,
      payments: expect.any(Array)
    });

    expect(queryMock).toHaveBeenNthCalledWith(1, `SELECT * FROM stripe_payments WHERE campaign_id = $1`, [50]);
  })

  test('getPaymentByCampaign handles case for no row found', async() => {
    queryMock.mockResolvedValueOnce({rows: []});
    const result = await payments.getPaymentByCampaign(50);

    expect(result).toEqual({
      exists: false,
      error: null,
      payments: null
    });

    expect(queryMock).toHaveBeenNthCalledWith(1, `SELECT * FROM stripe_payments WHERE campaign_id = $1`, [50]);
  });
  /**
   * paymentIntent.id, paymentIntent.client_secret, subscription.id, subscription.metadata.campaignId, paymentIntent.amount,
            paymentIntent.currency, paymentIntent.status, subscription.customer
   */

  test('createPaymentRecord handles error for unique violation in query', async() => {
    queryMock.mockResolvedValueOnce({rows: []})
    .mockRejectedValueOnce({code: '23505'})
    .mockResolvedValueOnce({});

    const result = await payments.createPaymentRecord({id: 10, client_secret: 10, amount: 99.0, status: 'successful', currency: 'usd' },
    {id: 10, metadata: {campaignId: 5}, customer: 'cus_123' });

    expect(queryMock).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(queryMock).toHaveBeenNthCalledWith(2, expect.stringContaining('INSERT INTO stripe_payments'),
     expect.any(Array));
    expect(queryMock).toHaveBeenNthCalledWith(3, 'ROLLBACK');

    expect(result).toEqual({error: "Duplicate payment record", created: false});
    
  });

  test('creatPaymentRecord returns expected value for normal insert', async() => {
    queryMock.mockResolvedValueOnce({rows: []})
    .mockResolvedValueOnce({})
    .mockResolvedValueOnce({});

    const result = await payments.createPaymentRecord({id: 10, client_secret: 10, amount: 99.0, status: 'successful', currency: 'usd' },
    {id: 10, metadata: {campaignId: 5}, customer: 'cus_123' });

    expect(queryMock).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(queryMock).toHaveBeenNthCalledWith(2, expect.stringContaining('INSERT INTO stripe_payments'),
     expect.any(Array));
    expect(queryMock).toHaveBeenNthCalledWith(3, 'COMMIT');

    expect(result).toEqual({error: null, created: true});
  });

  test('updateRecord handles error during query', async() => {
    queryMock.mockResolvedValueOnce({rows: []})
    .mockRejectedValueOnce({message: "Query error"})
    .mockResolvedValueOnce({});

    const result = await payments.updateRecord({id: 10, status: 'successful' });

    expect(queryMock).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(queryMock).toHaveBeenNthCalledWith(2, expect.stringContaining('UPDATE stripe_payments SET status'),
     expect.any(Array));
    expect(queryMock).toHaveBeenNthCalledWith(3, 'ROLLBACK');

    expect(result).toEqual({error: "Query error", updated: false});
  });

  test('updateRecord handles standard update', async() => {
    queryMock.mockResolvedValueOnce({rows: []})
    .mockResolvedValueOnce({rows: []})
    .mockResolvedValueOnce({});

    const result = await payments.updateRecord({id: 10, status: 'successful' });

    expect(queryMock).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(queryMock).toHaveBeenNthCalledWith(2, expect.stringContaining('UPDATE stripe_payments SET status'),
     expect.any(Array));
    expect(queryMock).toHaveBeenNthCalledWith(3, 'COMMIT');

    expect(result).toEqual({error: null, updated: true});
  });

});