import {jest, describe, expect, test, beforeEach} from '@jest/globals';

import {query, testConnection} from '../../db';
import app from '../../index';
import generateToken from '../../utils/jwtHelper';

import request from 'supertest';
import StatisticsService from '../../services/StatisticsService';
import Campaigns from '../../models/Campaigns';


const createToken = generateToken({email: 'samcbride11@gmail.com'}, false);

jest.mock('../../models/Campaigns');
jest.mock('../../services/StatisticsService');
jest.mock("../../db");

const mockedCampaigns = new Campaigns() as jest.Mocked<Campaigns>;
const mockedStatisticsService = new StatisticsService as jest.Mocked<StatisticsService>;

const expectedResponse = {
    status: {
        error: "",
        numberofActive: 0,
        numberofSetup: 0
    },
    statistics: {
        error: "" ,
        views: {
            lastDay: 0,
            lastWeek: 0
        },
        subscribers: {
            lastDay: 0,
            lastWeek: 0
        },
        campaigns: {}
    },
    errors: []
};


beforeEach(() => {
  jest.clearAllMocks();
})

describe('/campaign routes', () => {
  test('Should check if StatisticsService and baseStatistics are mocked correctly', async () => {
    mockedStatisticsService.getBaseStatisics.mockResolvedValue(expectedResponse);

    // Call the baseStatistics function in your service
    const result = await mockedStatisticsService.getBaseStatisics("test");

    // Assertions to check if the mock was called
    expect(mockedStatisticsService.getBaseStatisics).toHaveBeenCalled();
    expect(mockedStatisticsService.getBaseStatisics).toHaveBeenCalledTimes(1);

    // Check if the result is correct
    expect(result).toEqual(expectedResponse);
  });
  
  test('campaign/request route handles invalid token', async () => {
    const response = await request(app)
    .get('/campaign/request/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}a`); // a added to corrupt token

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'invalid signature');
  });

  test('campaign/request route returns 200 for correct token', async () => {
    mockedCampaigns.getCampaigns.mockResolvedValue({campaigns: [], error: ""});

    const response = await request(app)
    .get('/campaign/request/')
    .set('Authorization', `Bearer ${createToken.accessToken}`);

    expect(mockedCampaigns.getCampaigns).toBeCalled();
    expect(response.status).toBe(200);
  });

  test('campaign/statistics route returns 401 for missing token', async () => {
    const response = await request(app)
    .get('/campaign/statistics/')
    .set('Authorization', `Bearer`);

    expect(response.status).toBe(401);
  });

  test('/campaign/statistics handles error from getBaseStatistics correctly', async() => {

    const updatedResponse = {
      ...expectedResponse, errors: ['error']
    };

    mockedStatisticsService.getBaseStatisics.mockResolvedValue(updatedResponse);;
    const response = await request(app)
    .get('/campaign/statistics/')
    .set('Authorization', `Bearer ${createToken.accessToken}`);

    expect(mockedStatisticsService.getBaseStatisics).toHaveBeenCalled();
   

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('status', expect.any(Object));
    expect(response.body).toHaveProperty('statistics', expect.any(Object));
    expect(response.body).toHaveProperty('errors', expect.any(Array));
    expect(response.body.errors).not.toHaveLength(0);
    
  })

  test('campaign/statistics route returns 200 for standard request', async () => {
    mockedStatisticsService.getBaseStatisics.mockResolvedValue(expectedResponse);
    const response = await request(app)
    .get('/campaign/statistics/')
    .set('Authorization', `Bearer ${createToken.accessToken}`);

    expect(mockedStatisticsService.getBaseStatisics).toHaveBeenCalled();
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', expect.any(Object));
    expect(response.body).toHaveProperty('statistics', expect.any(Object));
    expect(response.body).toHaveProperty('errors', expect.any(Array));
    expect(response.body.errors).toHaveLength(0);

  });

})