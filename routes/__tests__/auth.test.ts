import {jest, describe, expect, test, beforeEach, afterAll} from '@jest/globals';
import request from 'supertest';
import app from '../../index';

import generateToken from '../../utils/jwtHelper';

const createdToken = generateToken({email: 'samcbride11@gmail.com'}, true);

jest.mock('../../db', () => ({
  query: jest.fn(),
  testConnection: jest.fn()
}));

describe('/auth/ testing', () => {
  test('/validate-token returns 401 for invalid token', async () => {
    const response = await request(app)
    .post('/auth/validate-token')
    .type('form')
    .send(`accessToken=${createdToken.accessToken}a`); // 'a' added to end of token to cause error

    expect(response.status).toBe(401);
    expect(response.body).toEqual({valid: false, message: "Invalid token" });
    
  });
  
  test('/validate-token returns 200 with email for valid data', async() => {
    const response = await request(app)
    .post('/auth/validate-token')
    .type('form')
    .send(`accessToken=${createdToken.accessToken}`);
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('valid', true);
    
  });
  
  
  test('/refresh-token returns 401 for no refresh token provided', async() => {
    const response = await request(app)
    .post('/auth/refresh-token')
    .type('form')
    .send(`refreshToken=`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Refresh token required');
    
  });

  test('/refresh-token returns 200 for valid refresh token', async() => {
    const response = await request(app)
    .post('/auth/refresh-token')
    .type('form')
    .send(`refreshToken=${createdToken.refreshToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    
  })

})