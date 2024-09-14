import { jest, describe, beforeEach, test, expect } from "@jest/globals";
import {query} from '../../db';
import Campaigns from "../Campaigns";


jest.mock('../../db');

const queryMock = query as jest.Mock;

describe('Campaigns model tests: ', () => {
  let campaigns: Campaigns;

  beforeEach(() => {
    campaigns = new Campaigns();
    jest.resetAllMocks();
  })

  test('checkExists should return true and campaign data when campaign exists', async () => {
    // Arrange: Mock the query function to return a campaign
    queryMock.mockResolvedValue({
      rows: [{ campaign_id: 1, plan_name: 'Plan A' }]
    });

    // Act: Call the method on the real class
    const result = await campaigns.checkExists(1);

    // Assert: Verify the result
    expect(result.exists).toBe(true);
    expect(result.campaigns).toEqual([{ campaign_id: 1, plan_name: 'Plan A' }]);
    expect(query).toHaveBeenCalledWith('SELECT * FROM campaigns WHERE campaign_id = $1', [1]);
  })

  test('checkExists should return exists false and error false for no rows', async() => {
    queryMock.mockResolvedValue({rows: []});
    const result = await campaigns.checkExists(5);

    expect(result.error).toBe(false);
    expect(result.exists).toBe(false);
    expect(result.campaigns).toHaveLength(0);

  })

  test('checkExists should return error and exists false for query error', async() => {
    queryMock.mockRejectedValue({error: "some error"});

    const result = await campaigns.checkExists(5);

    expect(result.error).toBeTruthy();
    expect(result.exists).toBe(false);
    expect(result.campaigns).toHaveLength(0);
  })

  test('getCampaigns should return campaigns and empty error', async() => {
    queryMock.mockResolvedValue({rows: [ {campaign_id: 60}] });

    const result = await campaigns.getCampaigns('email');

    expect(result.campaigns).toHaveLength(1);
    expect(result.error).toEqual("");
  })

  test('getCampaigns should return empty array for no results', async () => {
    queryMock.mockResolvedValue({rows: []});

    const result = await campaigns.getCampaigns('email');

    expect(result.error).toBeFalsy();
    expect(result.campaigns).toHaveLength(0);
  });

  test('addCampaign should throw error for invalid column', async() => {
    try {
      await campaigns.addCampaign({video_views: 5}, 'email');
    } catch(error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Invalid column video_views');
    }
  })

  test('addCampaign should throw error for missing column', async() => {
    try {
      await campaigns.addCampaign({
        video_link: 'youtube.com', price: 99.0, plan_name: "standard", 
        video_title: "video"
      }, 'email')
    } catch(error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('All necessary columns not provided');
    }

  })

  test('addCampaign should handle normal insert and return campaign_id', async() => {

    queryMock.mockResolvedValueOnce({})
    .mockResolvedValueOnce({rows: [{id: 5}]})
    .mockResolvedValueOnce({rows: [{campaign_id: 5}]})
    .mockResolvedValueOnce({rows: []});

    const insertData = {
      video_link: 'youtube.com', price: 99.0, plan_name: "standard", 
      video_title: "video", channel_title: "title"
    }
    const result = await campaigns.addCampaign(insertData, 'test@example.com');

    expect(queryMock).toHaveBeenCalledTimes(4); // Verify that all three queries were called
    expect(queryMock).toHaveBeenCalledWith('BEGIN');
    expect(queryMock).toHaveBeenCalledWith('SELECT ID FROM customers WHERE email = $1', ['test@example.com']);
    expect(queryMock).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO campaigns'), expect.any(Array));
    expect(queryMock).toHaveBeenCalledWith('COMMIT');


    expect(result.campaign_id).toEqual(5);
    expect(result.error).toBeFalsy();

  })


  test('addCampaign should handle error from query', async() => {

    //first two queries succeed before rejeting third
    queryMock.mockResolvedValueOnce({})
    .mockResolvedValueOnce({rows: [{id: 5}]})
    .mockRejectedValueOnce({message: "query error"})
    
    
    const insertData = {
      video_link: 'youtube.com', price: 99.0, plan_name: "standard", 
      video_title: "video", channel_title: "title"
    }

    const result = await campaigns.addCampaign(insertData, 'test@example.com');

    
    expect(queryMock).toHaveBeenCalledTimes(4); // Verify that all three queries were called
    expect(queryMock).toHaveBeenCalledWith('BEGIN');
    expect(queryMock).toHaveBeenCalledWith('SELECT ID FROM customers WHERE email = $1', ['test@example.com']);
    expect(queryMock).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO campaigns'), expect.any(Array));
    expect(queryMock).toHaveBeenCalledWith('ROLLBACK');

    expect(result.campaign_id).toEqual(-1);
    expect(result.error).toBe('query error');
  });

  test('updateColumns throws error when campaign does not exist', async() => {
    queryMock.mockResolvedValueOnce({rows: []});
    let result;

    try {
      result = await campaigns.updateColumns(5, {plan_name: 'Premium'}, 'test@example.com');

    } catch(error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toContain('Requested campaign to update doesn\'t exist or an error occured:');
    
    }
    expect(queryMock).toHaveBeenCalledTimes(1);

  })

  test('updateColumns throws error for invalid columm submitted', async() => {
    queryMock.mockResolvedValueOnce({rows: [{campaign_id: 5}]});
    let result;
    try {
      result = await campaigns.updateColumns(5, {video_tags: 'test'}) //invalid field
    } catch(error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('Invalid column video_tags');
    }

    expect(queryMock).toHaveBeenCalledTimes(1);
  })

  test('updateColumns handles error from query', async() => {
    queryMock.mockResolvedValueOnce({rows: [{campaign_id: 5}]})
    .mockResolvedValueOnce({rows:[]})
    .mockRejectedValueOnce({message: 'Query error'});

    const result = await campaigns.updateColumns(5, {plan_name: 'Pro'}, 'test@example.com');

    expect(queryMock).toHaveBeenCalledTimes(4);
    expect(queryMock).toHaveBeenCalledWith(`SELECT * FROM campaigns WHERE campaign_id = $1`, [5]);
    expect(queryMock).toHaveBeenCalledWith('BEGIN');
    expect(queryMock).toHaveBeenCalledWith(expect.stringContaining('UPDATE campaigns SET'), expect.any(Array));
    expect(queryMock).toHaveBeenCalledWith('ROLLBACK');

    expect(result.updated).toBe(false);
    expect(result.error).toEqual('Query error');

  })

  test('updateColumns handles normal update', async() => {
    queryMock.mockResolvedValueOnce({rows: [{campaign_id: 5}]})
    .mockResolvedValueOnce({rows:[]})
    .mockReturnValueOnce({rowCount: 1})
    .mockResolvedValueOnce({rows:[]});
    
    const result = await campaigns.updateColumns(5, {plan_name: 'Pro'}, 'test@exmaple.com');

    expect(queryMock).toHaveBeenCalledTimes(4);
    expect(queryMock).toHaveBeenCalledWith(`SELECT * FROM campaigns WHERE campaign_id = $1`, [5]);
    expect(queryMock).toHaveBeenCalledWith('BEGIN');
    expect(queryMock).toHaveBeenCalledWith(expect.stringContaining('UPDATE campaigns SET'), expect.any(Array));
    expect(queryMock).toHaveBeenCalledWith('COMMIT');

    expect(result.updated).toBe(true);
    expect(result.error).toBeFalsy();
  })

  test('getCampaigns returns normal result from query', async() => {
    queryMock.mockResolvedValueOnce({rows: [{campaign_id: 5}]});

    const result = await campaigns.getCampaigns('test@example.com');

    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(queryMock).toHaveBeenNthCalledWith(1, expect.stringContaining('SELECT ca.campaign_id'), ['test@example.com']);

    expect(result.error).toBeFalsy();
    expect(result.campaigns).toHaveLength(1);

  })

  test('getCampaigns handles error from query', async() => {
    queryMock.mockRejectedValueOnce({message: 'Query error'});

    const result = await campaigns.getCampaigns('test@example.com');

    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(queryMock).toHaveBeenNthCalledWith(1, expect.stringContaining('SELECT ca.campaign_id'), ['test@example.com']);

    expect(result.error).toBeTruthy();
    expect(result.campaigns).toHaveLength(0);

  })


});
