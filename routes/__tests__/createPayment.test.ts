import {jest, describe, expect, test, beforeEach} from '@jest/globals';

import {query, testConnection} from '../../db';
import app from '../../index';
import generateToken from '../../utils/jwtHelper';
import Stripe from 'stripe';

import request from 'supertest';

import Campaigns from '../../models/Campaigns';
import SessionsModel from '../../models/SessionsModel';
import Payments from '../../models/Payments';
import Customers from '../../models/Customers';
import StripeService from '../../services/StripeService';

jest.mock('../../models/Customers');
jest.mock('../../models/Campaigns');
jest.mock('../../models/SessionsModel');
jest.mock('../../models/Payments');
jest.mock('../../db');
jest.mock('../../services/StripeService');

const mockedCampaigns = new Campaigns() as jest.Mocked<Campaigns>;
const mockedSessionsModel = new SessionsModel() as jest.Mocked<SessionsModel>;
const mockedPayments = new Payments() as jest.Mocked<Payments>;
const mockedCustomers = new Customers() as jest.Mocked<Customers>;
const mockedStripeService = new StripeService() as jest.Mocked<StripeService>;

const createToken = generateToken({email: 'samcbride11@gmail.com'}, false);
  /**
   * paymentIntent.id, paymentIntent.client_secret, subscription.id, subscription.metadata.campaignId, paymentIntent.amount,
   *            paymentIntent.currency, paymentIntent.status, subscription.customer
   */

const mockSubscription = {
  id: "sub_124", metadata: {campaignId: 50}, customer: "cus_123",
  latest_invoice: {payment_intent: {
    amount: 99.0, currency: 'usd', status: 'not_attempted', client_secret: '123456789'
  }}
}


describe('createPayment route tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  })

  test('returns status 401 for missing token', async() => {

    mockedCampaigns.checkExists.mockResolvedValueOnce({error: "", exists: true, campaigns:[{campaign_id: 50}]});

    const response = await request(app)
    .post('/payment/create/')
    .type('form')
    .set('Authorization', `Bearer`)
    .set('SessionKey', '5000')
    .send('campaignId=50&plan_name=Premium');

    expect(mockedCampaigns.checkExists).toHaveBeenCalledTimes(1);
    
    expect(response.status).toEqual(401);
  
  });

  test('returns status 400 for missing session key', async() => {
    mockedCampaigns.checkExists.mockResolvedValueOnce({error: "", exists: true, campaigns:[{campaign_id: 50}]});

    const response = await request(app)
    .post('/payment/create/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}`)
    .send('campaignId=50&plan_name=Premium');

    expect(mockedCampaigns.checkExists).toHaveBeenCalledTimes(1);

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({message: "Missing session key"});
  })

  test("returns status 500 for error when checking if campaign exists", async() => {
    mockedCampaigns.checkExists.mockResolvedValueOnce({error: "Error", exists: false, campaigns:[]});

    const response = await request(app)
    .post('/payment/create/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}`)
    .set('SessionKey', '5000')
    .send('campaignId=50&plan_name=Premium');

    expect(mockedCampaigns.checkExists).toHaveBeenCalledTimes(1);

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({ message: "Internal server error. Please try again later." });

  });

  test('Returns 400 when campaign is not found', async() => {
    mockedCampaigns.checkExists.mockResolvedValueOnce({error: "", exists: false, campaigns:[]});

    const response = await request(app)
    .post('/payment/create/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}`)
    .set('SessionKey', '5000')
    .send('campaignId=50&plan_name=Premium');

    expect(mockedCampaigns.checkExists).toHaveBeenCalledTimes(1);

    expect(response.status).toEqual(400);

    expect(response.body).toEqual({messsage: "Campaign not found, unable to create payment."});
  })

  test('Returns 400 for non number campaign id', async() => {
    const response = await request(app)
    .post('/payment/create/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}`)
    .set('SessionKey', '5000')
    .send('campaignId=CI&plan_name=Premium');

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({message: "Invalid parameters"});

  })

  test('Returns 401 when customer does not have access to campaign', async() => {
    mockedCampaigns.checkExists.mockResolvedValueOnce({error: "", exists: true, campaigns:[{campaign_id: 50}]});
    mockedCustomers.checkCampaignBelongs.mockResolvedValueOnce(false);

    const response = await request(app)
    .post('/payment/create/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}`)
    .set('SessionKey', '5000')
    .send('campaignId=50&plan_name=Premium');

    expect(mockedCampaigns.checkExists).toHaveBeenCalledTimes(1);
    expect(mockedCustomers.checkCampaignBelongs).toHaveBeenCalledTimes(1);
    expect(mockedCustomers.checkCampaignBelongs).toHaveBeenNthCalledWith(1, 'samcbride11@gmail.com', 50);

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({message: "Cannot create payment, user unable access the requested campaign"});
  })

  test('Returns 409 when session already exists, no existing payment found', async() => {
    mockedCampaigns.checkExists.mockResolvedValueOnce({error: "", exists: true, campaigns:[{campaign_id: 50}]});
    mockedCustomers.checkCampaignBelongs.mockResolvedValueOnce(true);
    mockedSessionsModel.getSession.mockResolvedValueOnce({session: {idempotency_key: '5000'}, error: ""});
    mockedPayments.getPaymentByCampaign.mockResolvedValueOnce({exists: false, error: null, payments: null});

    const response = await request(app)
    .post('/payment/create/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}`)
    .set('SessionKey', '5000')
    .send('campaignId=50&plan_name=Premium');

    expect(mockedCampaigns.checkExists).toHaveBeenCalledTimes(1);
    expect(mockedCustomers.checkCampaignBelongs).toHaveBeenCalledTimes(1);
    expect(mockedPayments.getPaymentByCampaign).toHaveBeenCalledTimes(1);
    expect(mockedSessionsModel.getSession).toHaveBeenCalledTimes(1);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({message: "Duplicate request, please restart your session to complete the action."});
  });

  test('Returns 200 for existing client secret during duplicate request', async() => {
    mockedCampaigns.checkExists.mockResolvedValueOnce({error: "", exists: true, campaigns:[{campaign_id: 50}]});
    mockedCustomers.checkCampaignBelongs.mockResolvedValueOnce(true);
    mockedSessionsModel.getSession.mockResolvedValueOnce({session: {idempotency_key: '5000'}, error: ""});
    mockedPayments.getPaymentByCampaign.mockResolvedValueOnce({exists: true, error: null, payments: [{client_secret: '500'}]});

    const response = await request(app)
    .post('/payment/create/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}`)
    .set('SessionKey', '5000')
    .send('campaignId=50&plan_name=Premium');

    expect(mockedCampaigns.checkExists).toHaveBeenCalledTimes(1);
    expect(mockedCustomers.checkCampaignBelongs).toHaveBeenCalledTimes(1);
    expect(mockedPayments.getPaymentByCampaign).toHaveBeenCalledTimes(1);
    expect(mockedSessionsModel.getSession).toHaveBeenCalledTimes(1);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({clientSecret: "500"});
  })

  test('Returns 500 for error in creating subscription', async() => {
    mockedCampaigns.checkExists.mockResolvedValueOnce({error: "", exists: true, campaigns:[{campaign_id: 50}]});
    mockedCustomers.checkCampaignBelongs.mockResolvedValueOnce(true);
    mockedSessionsModel.getSession.mockResolvedValueOnce({session: null, error: ""});
    mockedSessionsModel.addSession.mockResolvedValueOnce({created: true, identifier: '5000', error: ""});
    mockedStripeService.createSubscription.mockRejectedValueOnce({message: 'Payment error'});

    const response = await request(app)
    .post('/payment/create/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}`)
    .set('SessionKey', '5000')
    .send('campaignId=50&plan_name=Premium');

    expect(mockedCampaigns.checkExists).toHaveBeenCalledTimes(1);
    expect(mockedCustomers.checkCampaignBelongs).toHaveBeenCalledTimes(1);
    expect(mockedSessionsModel.getSession).toHaveBeenCalledTimes(1);
    expect(mockedStripeService.createSubscription).toHaveBeenCalledTimes(1);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({error: "Payment error"});
  });

  test('returns 200 for successful creation', async() => {
    mockedCampaigns.checkExists.mockResolvedValueOnce({error: "", exists: true, campaigns:[{campaign_id: 50}]});
    mockedCustomers.checkCampaignBelongs.mockResolvedValueOnce(true);
    mockedSessionsModel.getSession.mockResolvedValueOnce({session: null, error: ""});
    mockedSessionsModel.addSession.mockResolvedValueOnce({created: true, identifier: '5000', error: ""});
    mockedStripeService.createSubscription.mockResolvedValueOnce({subscription: mockSubscription, error: null});
    mockedPayments.createPaymentRecord.mockResolvedValue({created: true, error: ""});
    mockedSessionsModel.updateSession.mockResolvedValueOnce({updated: true, error: null});

    const response = await request(app)
    .post('/payment/create/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}`)
    .set('SessionKey', '5000')
    .send('campaignId=50&plan_name=Premium');

    console.log('Response code', response.status);
    console.log('Response body', response.body);

    expect(mockedCampaigns.checkExists).toHaveBeenCalledTimes(1);
    expect(mockedCustomers.checkCampaignBelongs).toHaveBeenCalledTimes(1);
    expect(mockedSessionsModel.getSession).toHaveBeenCalledTimes(1);
    expect(mockedStripeService.createSubscription).toHaveBeenCalledTimes(1);
    expect(mockedPayments.createPaymentRecord).toHaveBeenCalledTimes(1);
    expect(mockedSessionsModel.updateSession).toHaveBeenCalledTimes(1);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({clientSecret: "123456789"});

  })




})