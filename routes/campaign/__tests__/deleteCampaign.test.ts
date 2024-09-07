import {jest, describe, expect, test, beforeEach} from '@jest/globals';

import {query, testConnection} from '../../../db';
import YouTubeService from '../../../services/YouTubeService';
import app from '../../../index';
import request from 'supertest';
import generateToken from '../../../utils/jwtHelper';
const createToken = generateToken({email: 'samcbride11@gmail.com'}, false);

YouTubeService.prototype.validateVideoLink = jest.fn().mockResolvedValue({
  valid: true, title: 'Test', channelTitle: 'Test Channel'
});

jest.spyOn(require('../../../db'), 'query').mockImplementation((text: string, params?: any[]) => {
  if (text.includes('UPDATE')) {
    return Promise.resolve({ rows: [{ campaign_id: 5, email: 'samcbride11@gmail.com'}] });
  } else if (text.includes('INSERT')) {
    return Promise.resolve({ rows: [{ campaign_id: 5 }] });
  } else {
    return Promise.resolve();
  }
});


jest.mock('../../../db', () => ({
  query: jest.fn(),
  testConnection: jest.fn()
}));

beforeEach(() => {
  jest.clearAllMocks();
})

describe('/campaign/delete/:id routes', () => {
  test('Returns 401 error for incorrect token', async () => {
    const response = await request(app)
    .delete('/campaign/delete/0')
    .set('Authorization', `Bearer ${createToken.token}a`);

    expect(response.status).toBe(401);

  })

  test('Returns 200 code for valid update', async () => {
    const response = await request(app)
    .delete('/campaign/delete/0')
    .set('Authorization', `Bearer ${createToken.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({message: "Campaign set to stopped"});
  })

  test('returns 500 error for error from database', async() => {
    jest.spyOn(require('../../../db'), 'query').mockImplementation((text: string, params?: any[]) => {
      return Promise.reject();
    });


    const response = await request(app)
    .delete('/campaign/delete/0')
    .set('Authorization', `Bearer ${createToken.token}`);

    expect(response.status).toBe(500);

  })
})