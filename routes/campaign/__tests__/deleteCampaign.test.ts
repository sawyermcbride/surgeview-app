import {jest, describe, expect, test, beforeEach} from '@jest/globals';

import app from '../../../index';
import request from 'supertest';
import generateToken from '../../../utils/jwtHelper';
import axios from 'axios';
import Campaigns from '../../../models/Campaigns';
const createToken = generateToken({email: 'samcbride11@gmail.com'}, false);


jest.mock('axios');
jest.mock('../../../models/Campaigns');

const mockedCampaigns = new Campaigns() as jest.Mocked<Campaigns>;

// Set up the mock for the updateColumns method
mockedCampaigns.updateColumns.mockResolvedValue({ updated: true, error: null });

jest.mock('../../../db', () => ({
  query: jest.fn(),
  testConnection: jest.fn()
}));


describe('/campaign/delete/:id routes', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  })

  test('Returns 401 error for incorrect token', async () => {
    const response = await request(app)
    .delete('/campaign/delete/0')
    .set('Authorization', `Bearer ${createToken.accessToken}a`);

    expect(response.status).toBe(401);

  })

  test('Returns 200 code for valid update', async () => {
    mockedCampaigns.updateColumns.mockResolvedValue({ updated: true, error: "" });

    const response = await request(app)
    .delete('/campaign/delete/0')
    .set('Authorization', `Bearer ${createToken.accessToken}`);

    expect(mockedCampaigns.updateColumns).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({message: "Campaign set to stopped"});
  })


  test('should return 400 when updateColumns fails', async () => {
    // Mock the return value for updateColumns
    mockedCampaigns.updateColumns.mockResolvedValue({ updated: false, error: "Some error" });

    const response = await request(app)
      .delete('/campaign/delete/2') // Adjust campaign ID as necessary
      .set('Authorization', `Bearer ${createToken.accessToken}`); // Add necessary headers

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Unable to update, error: Some error');
  });
})