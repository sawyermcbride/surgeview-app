//SubscriptionsModel tests

import {jest, describe, test, beforeEach, expect} from '@jest/globals';
import {query} from '../../db';

import SubscriptionsModel from '../SubscriptionsModel';

jest.mock('../../db');


const queryMock = query as jest.Mock;


describe('Subscriptions Model tests: ', () => {
  let subscriptionsModel: SubscriptionsModel;

  beforeEach(() => {
    subscriptionsModel = new SubscriptionsModel();
    jest.resetAllMocks();
  })

  test('Returns exists for query result', async() => {
    queryMock.mockReturnValueOnce({rows:[{id: 1, stripe_subscription_id: 'sub_32434'}], rowCount: 1});

    const result = await subscriptionsModel.getSubscription('sub_12345', 'cus_123456');

    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(queryMock).toHaveBeenNthCalledWith(1, expect.stringContaining('SELECT * FROM'), ['sub_12345', 'cus_123456']);

    expect(result?.exists).toEqual(true);
    expect(result.error).toBeFalsy();
    
  });
  
  test('Returns false for no query result', async() => {
    queryMock.mockResolvedValueOnce({rows:[], rowCount: 0});
    
    const result = await subscriptionsModel.getSubscription('sub_12345', 'cus_123456');
    

    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(queryMock).toHaveBeenNthCalledWith(1, expect.stringContaining('SELECT * FROM'), ['sub_12345', 'cus_123456']);
    
    
    expect(result?.exists).toEqual(false);
    expect(result.error).toBeFalsy();
  })
  
  test('Returns error for query error', async() => {
    queryMock.mockRejectedValueOnce({message: 'Query error'});
    
    const result = await subscriptionsModel.getSubscription('sub_12345', 'cus_123456');
    
    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(queryMock).toHaveBeenNthCalledWith(1, expect.stringContaining('SELECT * FROM'), ['sub_12345', 'cus_123456']);
  
    expect(result.exists).toEqual(false);
    expect(result.error).toEqual('Query error');
    
  });


})