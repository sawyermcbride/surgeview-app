import {jest, test, expect, describe, beforeEach} from '@jest/globals'

import {query, testConnection} from '../../db';
import app from '../../index';
import generateToken from '../../utils/jwtHelper';
import request from 'supertest';
import StripeService from '../../services/StripeService';
import SessionsModel from '../../models/SessionsModel';
import Campaigns from '../../models/Campaigns';
import Payments from '../../models/Payments';

jest.mock('../../db');
jest.mock('../../services/StripeService');
jest.mock('../../models/SessionsModel');
jest.mock('../../models/Campaigns');
jest.mock('../../models/Payments');

const mockedStripeService = new StripeService() as jest.Mocked<StripeService>;
const mockedSessionsModel = new SessionsModel() as jest.Mocked<SessionsModel>;
const mockedCampaigns = new Campaigns() as jest.Mocked<Campaigns>;
const mockedPayments = new Payments() as jest.Mocked<Payments>;

const createToken = generateToken({email: 'test@example.com'}, false);

describe('Payment routes tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Returns 400 for missing session key', async() => {
    const response = await request(app)
    .post('/payment/update-payment').type('form')
    .set('SessionKey', '').send('paymentIntentId=12345');

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({message: "Missing session key"});
  });

  test('Returns 401 for invalid token', async() => {
    const response = await request(app)
    .post('/payment/update-payment').type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}a`) //'a' added to corrupt token
    .set('SessionKey', '50005005').send('paymentIntentId=12345');

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({message: "Missing token"});
  });

  test('Returns 400 for missing paymentIntentId', async() => {
    const response = await request(app).post('/payment/update-payment')
    .type('form').set('Authorization', `Bearer ${createToken.accessToken}`) 
    .set('SessionKey', '50005005').send('paymentIntentId=');

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({message: "Invalid parameters"});

  });

  test('Returns 409 for duplicate session found', async() => {
    mockedSessionsModel.getSession.mockResolvedValue({session: { operation_type: 'CONFIRM_PAYMENT', status: 'PENDING'}, error: ""});

    const response = await request(app).post('/payment/update-payment')
    .type('form').set('Authorization', `Bearer ${createToken.accessToken}`) 
    .set('SessionKey', '50005005').send('paymentIntentId=12345');

    expect(response.status).toEqual(409);
    expect(response.body).toEqual({message: "Duplicate request, please restart your session to complete the action."});

  });

  test('Returns 409 for duplicate found during attempt to add session', async() => {
    mockedSessionsModel.getSession.mockResolvedValueOnce({session: null, error: ""});
    mockedSessionsModel.addSession.mockResolvedValueOnce({created: false, error: 'Duplicate'});

    const response = await request(app).post('/payment/update-payment')
    .type('form').set('Authorization', `Bearer ${createToken.accessToken}`) 
    .set('SessionKey', '50005005').send('paymentIntentId=12345');

    expect(response.status).toEqual(409);
    expect(response.body).toEqual({message: "Duplicate request, please restart your session to complete the action."});

  })

  test('Returns 500 for paymentIntent error', async() => {
    mockedSessionsModel.getSession.mockResolvedValue({session:null, error: ""})
    mockedSessionsModel.addSession.mockResolvedValueOnce({created: true, identifier: '50005005', error: ""})

    mockedStripeService.getPaymentIntent.mockResolvedValueOnce({error: "Payment intent error", paymentIntent: null});

    const response = await request(app).post('/payment/update-payment')
    .type('form').set('Authorization', `Bearer ${createToken.accessToken}`) 
    .set('SessionKey', '50005005').send('paymentIntentId=123456');

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({message: `An error occured updating your payment: Payment intent error`});

    expect(mockedStripeService.getPaymentIntent).toHaveBeenNthCalledWith(1, '123456');
  });


  test('Returns 500 for getInvoice error', async() => {
    mockedSessionsModel.getSession.mockResolvedValue({session:null, error: ""})
    mockedSessionsModel.addSession.mockResolvedValueOnce({created: true, identifier: '50005005', error: ""})

    mockedStripeService.getPaymentIntent.mockResolvedValueOnce({error: null, paymentIntent: {
      invoice: 'i_123'
    }});

    mockedStripeService.getInvoice.mockResolvedValueOnce({error: "invoice error", invoice: null});

    const response = await request(app).post('/payment/update-payment')
    .type('form').set('Authorization', `Bearer ${createToken.accessToken}`) 
    .set('SessionKey', '50005005').send('paymentIntentId=123456');

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({message: `An error occured updating your payment: invoice error`});
    
    
    expect(mockedSessionsModel.getSession).toHaveBeenNthCalledWith(1, '50005005', 'CONFIRM_PAYMENT');
    expect(mockedSessionsModel.addSession).toHaveBeenNthCalledWith(1, '50005005', 'CONFIRM_PAYMENT');
    expect(mockedStripeService.getPaymentIntent).toHaveBeenNthCalledWith(1, '123456');
    expect(mockedStripeService.getInvoice).toHaveBeenNthCalledWith(1, 'i_123');
  });


  test('Returns 500 for getSubscription error', async() => {
    mockedSessionsModel.getSession.mockResolvedValue({session:null, error: ""})
    mockedSessionsModel.addSession.mockResolvedValueOnce({created: true, identifier: '50005005', error: ""})
    mockedStripeService.getPaymentIntent.mockResolvedValueOnce({error: null, paymentIntent: {
      invoice: 'i_123'
    }});

    mockedStripeService.getInvoice.mockResolvedValueOnce({error: null, invoice: {
      subscription: 'sub_123'
    }});
    mockedStripeService.getSubscription.mockResolvedValueOnce({error: "subscription error", subscription: null})

    const response = await request(app).post('/payment/update-payment')
    .type('form').set('Authorization', `Bearer ${createToken.accessToken}`) 
    .set('SessionKey', '50005005').send('paymentIntentId=123456');

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({message: `An error occured updating your payment: subscription error`});

    expect(mockedSessionsModel.getSession).toHaveBeenNthCalledWith(1, '50005005', 'CONFIRM_PAYMENT');
    expect(mockedSessionsModel.addSession).toHaveBeenNthCalledWith(1, '50005005', 'CONFIRM_PAYMENT');
    expect(mockedStripeService.getPaymentIntent).toHaveBeenNthCalledWith(1, '123456');
    expect(mockedStripeService.getInvoice).toHaveBeenNthCalledWith(1, 'i_123');
    expect(mockedStripeService.getSubscription).toHaveBeenNthCalledWith(1, 'sub_123');
  });

  test('Returns 500 for error during campaigs.updatePaymentStatus', async() => {

    mockedSessionsModel.getSession.mockResolvedValue({session:null, error: ""})
    mockedSessionsModel.addSession.mockResolvedValueOnce({created: true, identifier: '50005005', error: ""})
    mockedStripeService.getPaymentIntent.mockResolvedValueOnce({error: null, paymentIntent: {
      invoice: 'i_123', status: 'successful'
    }});

    mockedStripeService.getInvoice.mockResolvedValueOnce({error: null, invoice: {
      subscription: 'sub_123'
    }});
    mockedStripeService.getSubscription.mockResolvedValueOnce({error: "", subscription: {id: 'sub_123', 
      metadata: {campaignId: 50}
    }});

    mockedCampaigns.updatePaymentStatus.mockResolvedValueOnce({updated: false, error: "Some error"});
    mockedPayments.updateRecord.mockResolvedValueOnce({updated: true, error: false});

    const response = await request(app).post('/payment/update-payment')
    .type('form').set('Authorization', `Bearer ${createToken.accessToken}`) 
    .set('SessionKey', '50005005').send('paymentIntentId=123456');

    expect(response.status).toEqual(500);
    expect(response.body).toHaveProperty('message', expect.stringContaining('An error occured updating your payment:'));

    expect(mockedSessionsModel.getSession).toHaveBeenNthCalledWith(1, '50005005', 'CONFIRM_PAYMENT');
    expect(mockedSessionsModel.addSession).toHaveBeenNthCalledWith(1, '50005005', 'CONFIRM_PAYMENT');
    expect(mockedStripeService.getPaymentIntent).toHaveBeenNthCalledWith(1, '123456');
    expect(mockedStripeService.getInvoice).toHaveBeenNthCalledWith(1, 'i_123');
    expect(mockedStripeService.getSubscription).toHaveBeenNthCalledWith(1, 'sub_123');
    expect(mockedCampaigns.updatePaymentStatus).toHaveBeenNthCalledWith(1, 50, 'successful', 'test@example.com');
    expect(mockedPayments.updateRecord).toHaveBeenNthCalledWith(1,  {
      invoice: 'i_123', status: 'successful'
    });

  });

  test('Returns 500 for error in payments.updateRecord', async() => {

    mockedSessionsModel.getSession.mockResolvedValue({session:null, error: ""})
    mockedSessionsModel.addSession.mockResolvedValueOnce({created: true, identifier: '50005005', error: ""})
    mockedStripeService.getPaymentIntent.mockResolvedValueOnce({error: null, paymentIntent: {
      invoice: 'i_123', status: 'successful'
    }});

    mockedStripeService.getInvoice.mockResolvedValueOnce({error: null, invoice: {
      subscription: 'sub_123'
    }});
    mockedStripeService.getSubscription.mockResolvedValueOnce({error: "", subscription: {id: 'sub_123', 
      metadata: {campaignId: 50}
    }});

    mockedCampaigns.updatePaymentStatus.mockResolvedValueOnce({updated: true, error: ""});
    mockedPayments.updateRecord.mockResolvedValueOnce({updated: false, error: true});

    const response = await request(app).post('/payment/update-payment')
    .type('form').set('Authorization', `Bearer ${createToken.accessToken}`) 
    .set('SessionKey', '50005005').send('paymentIntentId=123456');

    expect(response.status).toEqual(500);
    expect(response.body).toHaveProperty('message', expect.stringContaining('An error occured updating your payment:'));

    expect(mockedSessionsModel.getSession).toHaveBeenNthCalledWith(1, '50005005', 'CONFIRM_PAYMENT');
    expect(mockedSessionsModel.addSession).toHaveBeenNthCalledWith(1, '50005005', 'CONFIRM_PAYMENT');
    expect(mockedStripeService.getPaymentIntent).toHaveBeenNthCalledWith(1, '123456');
    expect(mockedStripeService.getInvoice).toHaveBeenNthCalledWith(1, 'i_123');
    expect(mockedStripeService.getSubscription).toHaveBeenNthCalledWith(1, 'sub_123');
    expect(mockedCampaigns.updatePaymentStatus).toHaveBeenNthCalledWith(1, 50, 'successful', 'test@example.com');
    expect(mockedPayments.updateRecord).toHaveBeenNthCalledWith(1,  {
      invoice: 'i_123', status: 'successful'
    });
  })

  test('Returns 200 ok for succesful update payment with expected json data', async() => {
    
    mockedSessionsModel.getSession.mockResolvedValue({session:null, error: ""})
    mockedSessionsModel.addSession.mockResolvedValueOnce({created: true, identifier: '50005005', error: ""})
    mockedStripeService.getPaymentIntent.mockResolvedValueOnce({error: null, paymentIntent: {
      invoice: 'i_123', status: 'successful'
    }});

    mockedStripeService.getInvoice.mockResolvedValueOnce({error: null, invoice: {
      subscription: 'sub_123'
    }});
    mockedStripeService.getSubscription.mockResolvedValueOnce({error: "", subscription: {id: 'sub_123', 
      metadata: {campaignId: 50}
    }});

    mockedCampaigns.updatePaymentStatus.mockResolvedValueOnce({updated: true, error: ""});
    mockedPayments.updateRecord.mockResolvedValueOnce({updated: true, error: false});

    const response = await request(app).post('/payment/update-payment')
    .type('form').set('Authorization', `Bearer ${createToken.accessToken}`) 
    .set('SessionKey', '50005005').send('paymentIntentId=123456');

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({updated: true, success: true, status: 'successful',
      campaignConnected: 50});
    
    console.log(response.body);

    expect(mockedSessionsModel.getSession).toHaveBeenNthCalledWith(1, '50005005', 'CONFIRM_PAYMENT');
    expect(mockedSessionsModel.addSession).toHaveBeenNthCalledWith(1, '50005005', 'CONFIRM_PAYMENT');
    expect(mockedStripeService.getPaymentIntent).toHaveBeenNthCalledWith(1, '123456');
    expect(mockedStripeService.getInvoice).toHaveBeenNthCalledWith(1, 'i_123');
    expect(mockedStripeService.getSubscription).toHaveBeenNthCalledWith(1, 'sub_123');
    expect(mockedCampaigns.updatePaymentStatus).toHaveBeenNthCalledWith(1, 50, 'successful', 'test@example.com');
    expect(mockedPayments.updateRecord).toHaveBeenNthCalledWith(1,  {
      invoice: 'i_123', status: 'successful'
    });

  })


})