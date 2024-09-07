import {jest, describe, expect, test, beforeEach, afterAll} from '@jest/globals';

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
  if (text.includes('SELECT')) {
    return Promise.resolve({ rows: [{ email: 'samcbride11@gmail.com'}] });
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
  // server = app.listen(3001);
  jest.clearAllMocks();
})

test('true', () => {
  expect(1+3).toBe(4);
})

describe('/campaign/add/ routes', () => {
  test('Submits missing data in request, returns 400 error', async () => {
    const response = await request(app)
    .post('/campaign/add/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.token}`)
    .send('videoLink=youtube.com/test&plan=');

    expect(response.status).toBe(400);
  })

  test('Return 400 error for plan name not part of plans', async () => {
    const response = await request(app)
    .post('/campaign/add/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.token}`)
    .send('videoLink=youtube.com/test&plan=Main');

    expect(response.status).toBe(400);
  })

  test('Return 201 code for valid data', async () => {
    const response = await request(app)
    .post('/campaign/add/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.token}`)
    .send('videoLink=youtube.com/test&plan=Premium');

    expect(response.status).toBe(201);
  });

})