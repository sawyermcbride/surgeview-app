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



jest.mock('../../../db', () => ({
  query: jest.fn(),
  testConnection: jest.fn()
}));

beforeEach(() => {
  jest.spyOn(require('../../../db'), 'query').mockImplementation((text: string, params?: any[]) => {
    if (text.includes('SELECT')) {
      return Promise.resolve({ rows: [{ campaign_id: 5, video_link: 'test', plan_name: 'test', status: 'test' }] });
    } else if (text.includes('UPDATE')) {
      return Promise.resolve({ rows: [{ campaign_id: 5, updated: true }] });
    } else {
      return Promise.reject(new Error('Unknown query'));
    }
  });
  jest.clearAllMocks();
})

describe('Update campaign routes', () => {
  test('returns status 400 for no data in request', async() => {
    const response = await request(app)
    .put('/campaign/update/50')
    .type('form')
    .set('Authorization', `Bearer ${createToken.token}`)
    .send('video_link=&plan_name=&status=');

    expect(response.status).toBe(400);    
  })

  test('returns status 400 for unmatched plan name', async () => {
    const response = await request(app)
    .put('/campaign/update/50')
    .type('form')
    .set('Authorization', `Bearer ${createToken.token}`)
    .send('video_link=&plan_name=Test');

    expect(response.status).toBe(400);    
  });

  test('returns status 500 for error in accessing database', async () => {

    jest.spyOn(require('../../../db'), 'query').mockImplementation((text: string, params?: any[]) => { 
      throw new Error("Database error");
    });

    const response = await request(app)
    .put('/campaign/update/50')
    .type('form')
    .set('Authorization', `Bearer ${createToken.token}`)
    .send('video_link=youtube.com/testvideo&plan_name=Premium');
    
    expect(response.status).toBe(500);    
  })
  
  test('Expect response of 200 for updating video link', async () => {

    const response = await request(app)
    .put('/campaign/update/50')
    .type('form')
    .set('Authorization', `Bearer ${createToken.token}`)
    .send('video_link=testlink&plan_name=Premium');
    expect(YouTubeService.prototype.validateVideoLink).toHaveBeenCalled();
    expect(query).toHaveBeenCalled()
    expect(response.status).toBe(200);
  })

})