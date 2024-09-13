//StatisticsService.test.ts

import {jest, describe, test, beforeEach, expect} from '@jest/globals';
import {query} from '../../db';
import StatisticsService from '../StatisticsService';

import bcrypt from 'bcrypt';

jest.mock('../../db');
jest.mock('bcrypt');

const queryMock = query as jest.Mock;

const data = [{id: 1	, campaign_id:  39,views: 	150, likes: 0	, comments: 2, start_timestamp:	"2024-08-31 00:00:00", 
  end_timestamp:	"2024-08-31 23:59:59",time_period:	"day", subscribers:	5},
{id: 2	, campaign_id:  39,views: 	400, likes:	0	, comments: 0, start_timestamp:	"2024-08-29 00:00:00",
  
  end_timestamp:	"2024-08-30 23:59:59",time_period:	"day", subscribers:	5},
{id: 3	, campaign_id:  39,views: 	25	, likes:5	, comments: 1, start_timestamp:	"2024-08-28 00:00:00",
  
  end_timestamp:	"2024-08-28 23:59:59",time_period:	"day", subscribers:	6},
{id: 4	, campaign_id:  39,views: 	25	, likes:5	, comments: 1, start_timestamp:	"2024-08-27 00:00:00",
  
  end_timestamp:	"2024-08-27 23:59:59",time_period:	"day", subscribers:	6},
{id: 5	, campaign_id:  39,views: 	105, likes:	5	, comments: 0, start_timestamp:	"2024-09-02 08:00:00",
  
  end_timestamp:	"2024-09-03 08:00:00",time_period:	"day", subscribers:	4},
{id: 6	, campaign_id:  39,views: 	105, likes:	5	, comments: 0, start_timestamp:	"2024-09-03 08:00:00",
  
  end_timestamp:	"2024-09-04 08:00:00",time_period:	"day", subscribers:	4},
{id: 7	, campaign_id:  39,views: 	95	, likes:10, comments: 3, start_timestamp:	"2024-09-04 08:00:00",
  
  end_timestamp:	"2024-09-05 08:00:00",time_period:	"day", subscribers:	4},
{id: 8	, campaign_id:  39,views: 	175, likes:	9	, comments: 0, start_timestamp:	"2024-09-05 08:00:00",
  
  end_timestamp:	"2024-09-06 08:00:00",time_period:	"day", subscribers:	8},
{id: 9	, campaign_id:  39,views: 	175, likes:	9	, comments: 0, start_timestamp:	"2024-09-05 08:00:00",
  
  end_timestamp:	"2024-09-06 08:00:00",time_period:	"day", subscribers:	8},
{id: 10, campaign_id:	39, views: 175	, likes:  9	, comments: 0, start_timestamp:	"2024-09-07 08:00:00",
   end_timestamp:	"2024-09-08 08:00:00",time_period:	"day", subscribers:	8}]


   const campaign_data = [{campaign_id: 122, customer_id:	23, video_link:	"https://www.youtube.com/watch?v=aHZW7TuY_yo", price:	199.00, plan_name:	"Premium",status:"setup", created_at:	"2024-09-11 08:48:41.69313"	, 
updated_at: "2024-09-11 08:48:41.69313", 
video_title: "How I would learn Leetcode if I could start over",	  channel_title: "NeetCodeIO", payment_status:	"not_attempted"},
{campaign_id: 123, customer_id:	23, video_link:	"https://www.youtube.com/watch?v=aHZW7TuY_yo", price:	199.00, plan_name:	"Premium",status:"setup", created_at:	"2024-09-11 08:48:41.734572", 
updated_at: 	"2024-09-11 08:48:41.734572", 
video_title: 	"How I would learn Leetcode if I could start over",	channel_title: "NeetCodeIO", payment_status:	"not_attempted"}]
  


describe('Statistics service tests: ', () => {
  let statisticsService: StatisticsService;

  beforeEach(() => {
    statisticsService = new StatisticsService();
    jest.resetAllMocks();
  });

  test('Handles error for invalid email with no match', async() => {
    queryMock.mockResolvedValueOnce({rows: []})
    .mockResolvedValueOnce({rows: []});

    const result = await statisticsService.getBaseStatisics('invalid@example.com');

    expect(queryMock).toHaveBeenCalledTimes(2);
    
    expect(result).toHaveProperty('errors');
    expect(result.errors).toHaveLength(0);

    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('statistics');

    expect(result.status).toMatchObject({
      error: "",
      numberofActive: 0,
      numberofSetup: 0
    });

    expect(result.statistics).toMatchObject({
      error: "",
      views: {
          lastDay: 0,
          lastWeek: 0,
      }, 
      subscribers: {
          lastDay: 0,
          lastWeek: 0
      },
      campaigns: {}
    }); 

  })

  test('Handles query errors', async() => {
    queryMock.mockRejectedValueOnce({message: 'Query error'})
    .mockRejectedValueOnce({message: 'Query error'});

    const result = await statisticsService.getBaseStatisics('invalid@example.com');

    expect(queryMock).toHaveBeenCalledTimes(2);
    
    expect(result).toHaveProperty('errors');
    expect(result.errors).toHaveLength(2);

    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('statistics');

    expect(result.status).toMatchObject({
      error: "Query error",
      numberofActive: 0,
      numberofSetup: 0
    });

    expect(result.statistics).toMatchObject({
      error: "Query error",
      views: {
          lastDay: 0,
          lastWeek: 0,
      }, 
      subscribers: {
          lastDay: 0,
          lastWeek: 0
      },
      campaigns: {}
    }); 
  })


  test('Handles normal query return', async() => {
    queryMock.mockResolvedValue({rows: data})
    .mockResolvedValueOnce({rows: campaign_data});

    const result = await statisticsService.getBaseStatisics('invalid@example.com');

    expect(queryMock).toHaveBeenCalledTimes(2);
    
    expect(result).toHaveProperty('errors');
    expect(result.errors).toHaveLength(0);

    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('statistics');

    expect(result.status).toMatchObject({
      error: "",
      numberofActive: 0,
      numberofSetup: 2
    });

    expect(result.statistics).toMatchObject({
      error: "",
      views: {
          lastDay: 150,
          lastWeek: 525,
      }, 
      subscribers: {
          lastDay: 5,
          lastWeek: 24
      },
      campaigns: expect.any(Object)
    }); 
  })
  
});


