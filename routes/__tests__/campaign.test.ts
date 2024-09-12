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

beforeEach(() => {
  jest.clearAllMocks();
})

describe('/campaign routes', () => {
  test('Should check if StatisticsService and baseStatistics are mocked correctly', async () => {
    mockedStatisticsService.getBaseStatisics.mockResolvedValue({
      totalViews: 1000,
      totalClicks: 100,
      totalConversions: 10,
    })

    // Call the baseStatistics function in your service
    const result = await mockedStatisticsService.getBaseStatisics("test");

    // Assertions to check if the mock was called
    expect(mockedStatisticsService.getBaseStatisics).toHaveBeenCalled();
    expect(mockedStatisticsService.getBaseStatisics).toHaveBeenCalledTimes(1);

    // Check if the result is correct
    expect(result).toEqual({
      totalViews: 1000,
      totalClicks: 100,
      totalConversions: 10,
    });
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
    mockedStatisticsService.getBaseStatisics.mockResolvedValue({error: "error", statistics: {}, status: {}});;
    const response = await request(app)
    .get('/campaign/statistics/')
    .set('Authorization', `Bearer ${createToken.accessToken}`);
   
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message');
    
  })

  test('campaign/statistics route returns 200 for standard request', async () => {
    mockedStatisticsService.getBaseStatisics.mockResolvedValue({error: "", statistics: {}, status: {}});;
    const response = await request(app)
    .get('/campaign/statistics/')
    .set('Authorization', `Bearer ${createToken.accessToken}`);

    expect(mockedStatisticsService.getBaseStatisics).toHaveBeenCalled();
    expect(response.status).toBe(200);
    // expect(response.body).toBe(JSON);
  });

})