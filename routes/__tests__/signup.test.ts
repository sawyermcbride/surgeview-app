import {jest, describe, expect, test, beforeEach} from '@jest/globals';

import app from '../../index';
import request from 'supertest';

import Customers from '../../models/Customers';


jest.mock('../../models/Customers');

jest.mock("../../db");

const mockedCustomers = new Customers() as jest.Mocked<Customers>;


describe('Signup controller tests ',() => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  test('Returns status 400 for missing email ', async() => {

    const response = await request(app)
    .post('/signup')
    .type('form')
    .send('email=&password=TestPassword2025');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({error: "Invalid email format", email:""});
  });

  test('Returns status 400 for invalid email ', async() => {

    const response = await request(app)
    .post('/signup')
    .type('form')
    .send('email=test@example&password=TestPassword2025');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({error: "Invalid email format", email:"test@example"});
  });


  test('Returns status 400 for invalid password ', async() => {

    const response = await request(app)
    .post('/signup')
    .type('form')
    .send('email=test@example.com&password=testpassword2025');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({error: "Password format invalid", password:"testpassword2025"});
  });

  test('Returns status 400 for invalid length password ', async() => {

    const response = await request(app)
    .post('/signup')
    .type('form')
    .send('email=test@example.com&password=test');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({error: "Password format invalid", password:"test"});
  });
  test('Returns status 400 for missing password', async() => {

    const response = await request(app)
    .post('/signup')
    .type('form')
    .send('email=test@example.com&password=');
    
    expect(response.status).toBe(400);
    expect(response.body).toEqual({error: "Password format invalid", password:""});
  });
  
  test('Successful customer creation with 201 status code', async() => {
    mockedCustomers.createCustomer.mockResolvedValueOnce(
      {created: true, email: '', error: '', message: '' });
      
      const response = await request(app)
      .post('/signup').type('form')
      .send('email=test@example.com&password=TestPassword2025');

      expect(mockedCustomers.createCustomer).toHaveBeenCalledTimes(1);
      expect(mockedCustomers.createCustomer).toHaveBeenNthCalledWith(1, 'test@example.com', 'TestPassword2025');
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered succesfully');
      expect(response.body).toHaveProperty('token')
      expect(response.body.token).not.toHaveLength(0)
      expect(response.body).toHaveProperty('refreshToken')
      expect(response.body.refreshToken).not.toHaveLength(0);
  })

  test('Duplicate customer email returns 409 status', async() => {
    mockedCustomers.createCustomer.mockResolvedValueOnce(
      {created: false, email: '', error: 'duplicate', message: 'Email already in use.' });
      
      const response = await request(app)
      .post('/signup').type('form')
      .send('email=test@example.com&password=TestPassword2025');

      expect(mockedCustomers.createCustomer).toHaveBeenCalledTimes(1);
      expect(mockedCustomers.createCustomer).toHaveBeenNthCalledWith(1, 'test@example.com', 'TestPassword2025');
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('message', 'Email already in use.');
      
  })
  test('Returns 500 for errr increating customer', async() => {
    mockedCustomers.createCustomer.mockRejectedValueOnce({message: 'error'});

    const response = await request(app)
    .post('/signup').type('form')
    .send('email=test@example.com&password=TestPassword2025');

    expect(mockedCustomers.createCustomer).toHaveBeenCalledTimes(1);
    expect(mockedCustomers.createCustomer).toHaveBeenNthCalledWith(1, 'test@example.com', 'TestPassword2025');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', "Error registering user");    

  })

});