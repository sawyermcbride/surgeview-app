import {jest, describe, expect, test, beforeEach} from '@jest/globals';

import {query, testConnection} from '../../db';
import app from '../../index';
import generateToken from '../../utils/jwtHelper';

import request from 'supertest';
import StatisticsService from '../../services/StatisticsService';
import Customers from '../../models/Customers';


const createToken = generateToken({email: 'samcbride11@gmail.com'}, false);

jest.mock('../../models/Customers');

jest.mock("../../db");

const mockedCustomers = new Customers() as jest.Mocked<Customers>;


describe('Login controller tests ',() => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  test('Returns status 400 for missing email ', async() => {

    const response = await request(app)
    .post('/login')
    .type('form')
    .send('email=&password=TestPassword2025');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Missing email or password" });

  });

  test('Returns status 400 for missing password ', async() => {

    const response = await request(app)
    .post('/login')
    .type('form')
    .send('email=test@example.com&password=');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Missing email or password" });

  });

  test('Returns status 200, accessToken, and refreshToken for successful login ', async() => {
    mockedCustomers.login.mockResolvedValue({login: true, errorMessage: '', email: '' });

    const response = await request(app)
    .post('/login').type('form')
    .send('email=test@example.com&password=TestPassword2025');

    expect(mockedCustomers.login).toBeCalledTimes(1);
    expect(mockedCustomers.login).toHaveBeenNthCalledWith(1, 'test@example.com', 'TestPassword2025');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.token).not.toHaveLength(0);

    expect(response.body).toHaveProperty('refreshToken');
    expect(response.body.refreshToken).not.toHaveLength(0);
  });

  test('Returns status 400 for non existing user during login', async() => {
    mockedCustomers.login.mockResolvedValueOnce({login:false, errorType: 'user'});

    const response = await request(app)
    .post('/login').type('form')
    .send('email=test@example.com&password=TestPassword2025');

    expect(mockedCustomers.login).toBeCalledTimes(1);
    expect(mockedCustomers.login).toHaveBeenNthCalledWith(1, 'test@example.com', 'TestPassword2025');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({message: "No user exists with that email", type: 'user'});

  })

  test('Returns status 401 for wrong password during login', async() => {
    mockedCustomers.login.mockResolvedValueOnce({login:false, errorType: 'password'});

    const response = await request(app)
    .post('/login').type('form')
    .send('email=test@example.com&password=TestPassword2025');

    expect(mockedCustomers.login).toBeCalledTimes(1);
    expect(mockedCustomers.login).toHaveBeenNthCalledWith(1, 'test@example.com', 'TestPassword2025');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({message: "Password invalid", type: 'password'});

  })

})
