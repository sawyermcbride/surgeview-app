import {jest, describe, expect, test, beforeEach} from '@jest/globals';
import express, {Request, Response} from "express";
import {query, testConnection} from '../../db';
import app from '../../index';
import generateToken from '../../utils/jwtHelper';

import request from 'supertest';
import StatisticsService from '../../services/StatisticsService';

const createToken = generateToken({email: 'samcbride11@gmail.com'}, false);


StatisticsService.prototype.getBaseStatisics = jest.fn().mockResolvedValue({
  status: 70
});

jest.mock('../../db', () => ({
  query: jest.fn(),
  testConnection: jest.fn()
}));

beforeEach(() => {
  jest.spyOn(require('../../db'), 'query').mockImplementation((text: string, params?: any[]) => {
    if (text.includes('SELECT id FROM')) {
      return Promise.resolve({ rows: [{id: 5}] });
    } else if (text.includes('SELECT * FROM')) {
      return Promise.resolve({ rows: [{ campaign_id: 5 }, { campaign_id: 6 }] });
    } else {
      return Promise.resolve({ rows: [{ campaign_id: 5 }, { campaign_id: 6 }] });
      return Promise.reject(new Error('Unknown query'));
    }
  });
  jest.clearAllMocks();
})

describe('/campaign routes', () => {
  test('campaign/request route handles invalid token', async () => {
    const response = await request(app)
    .get('/campaign/request/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.token}a`); // a added to corrupt token

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'invalid signature');
  });

  test('campaign/request route returns 200 for correct token', async () => {
    const response = await request(app)
    .get('/campaign/request/')
    .set('Authorization', `Bearer ${createToken.token}`);

    expect(response.status).toBe(200);
  });

  test('campaign/statistics route returns 401 for missing token', async () => {
    const response = await request(app)
    .get('/campaign/statistics/')
    .set('Authorization', `Bearer`);

    expect(response.status).toBe(401);
  });

  test('campaign/statistics route returns 200 for standard request', async () => {
    const response = await request(app)
    .get('/campaign/statistics/')
    .set('Authorization', `Bearer ${createToken.token}`);

    // expect(StatisticsService.prototype.getBaseStatisics).toHaveBeenCalled();
    expect(response.status).toBe(200);
    // expect(response.body).toBe(JSON);
  });

})