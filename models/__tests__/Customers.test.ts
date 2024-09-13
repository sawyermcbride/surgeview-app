import {jest, describe, test, beforeEach, expect} from '@jest/globals';
import {query} from '../../db';
import Customers from '../Customers';
import { customConversionGoal } from 'google-ads-api/build/src/protos/autogen/resourceNames';
import bcrypt from 'bcrypt';

jest.mock('../../db');
jest.mock('bcrypt');

const queryMock = query as jest.Mock;
const mockedHash = bcrypt.hash as jest.Mock;

describe('Campaigns model tests: ', () => {
  let customers: Customers;

  beforeEach(() => {
    customers = new Customers();
    jest.resetAllMocks();
  })

  test('checkCampaignBelongs: expect true response for query return containing a row', async() => {
    queryMock.mockResolvedValue({rows: [{email: 'test@example.com', campaign_id: 5}]});

    const result = await customers.checkCampaignBelongs('test@example.com', 5);

    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(queryMock).toHaveBeenNthCalledWith(1, expect.stringContaining('SELECT'), [5, 'test@example.com']);

    expect(result).toEqual(true);

  })

  test('checkCampaignBelongs: expect return false for no matching campaign or customer', async() => {
    queryMock.mockResolvedValue({rows: []});

    const result = await customers.checkCampaignBelongs('test@example.com', 5);

    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(queryMock).toHaveBeenNthCalledWith(1, expect.stringContaining('SELECT'), [5, 'test@example.com']);

    expect(result).toEqual(false);
  })

  test('checkCampaignBelongs: expect return false for error thrown by query', async() => {
    queryMock.mockRejectedValue({message: 'Query error'});

    const result = await customers.checkCampaignBelongs('test@example.com', 5);

    expect(result).toEqual(false);
  })

  test(`checkCampaignBelongs: empty email or invalid campaignId to function, 
    expect false with no errors`, async() => {
      queryMock.mockRejectedValue({message: 'Invalid parameters'});

      const result = await customers.checkCampaignBelongs('', -1);

      expect(queryMock).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);

  })

  test('createCustomer: successful customer creation', async() => {
    queryMock.mockResolvedValueOnce({rows: []})
    .mockResolvedValueOnce({rows: []})
    .mockResolvedValueOnce({rows:[{id: 5, email: 'test@example.com'}]})
    .mockResolvedValueOnce({rows:[]});

    const result = await customers.createCustomer('test@example.com', 'TestPassword2025');
    console.log('Result');
    console.log(result);

    expect(queryMock).toHaveBeenCalledTimes(4);
    expect(queryMock).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(queryMock).toHaveBeenNthCalledWith(2, expect.stringContaining('SELECT id'), expect.any(Array));
    expect(queryMock).toHaveBeenNthCalledWith(3, expect.stringContaining('INSERT INTO customers'),
     expect.any(Array));
    expect(queryMock).toHaveBeenNthCalledWith(4, 'COMMIT');
    
    expect(result.created).toEqual(true);
    expect(result.error).toEqual('');
    expect(result.email).toEqual('test@example.com');
  });

  test('createCustomer: returns created false and expected error for duplicate email', async() => {
    queryMock.mockResolvedValueOnce({rows: []})
    .mockResolvedValueOnce({rows:[ {id: 5}]});

    const result = await customers.createCustomer('test@example.com', 'TestPassword2025');

    expect(queryMock).toHaveBeenCalledTimes(2);
    expect(queryMock).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(queryMock).toHaveBeenNthCalledWith(2, expect.stringContaining('SELECT id'), ['test@example.com']);

    expect(result).toEqual({created: false, error: 'duplicate',  email: '', message: 'Email already in use.'});
  })

  test('createCustomer: handles error during query and returns expected values', async() => {
    queryMock.mockReturnValueOnce({rows: []})
    .mockRejectedValueOnce({message: 'error message'});

    const result = await customers.createCustomer('test@example.com', 'TestPassword2025');
    
    expect(queryMock).toHaveBeenCalledTimes(3);
    
    expect(result).toEqual({created: false, error: 'other', email: '', message: 'error message'});

  });

  test('createCustomer: handles error from bcrypt', async() => {
    queryMock.mockResolvedValue({rows: []});

    mockedHash.mockRejectedValueOnce({message: 'invalid password'});
    const result = await customers.createCustomer('test@example.com', 'TestPassword2025');

    expect(queryMock).toHaveBeenCalledTimes(2)
    expect(mockedHash).toHaveBeenCalled();
    
    expect(result).toEqual({created: false, error: 'other', email: '', message: 'invalid password'});
  
  })

})