import {jest, describe, expect, test, beforeEach, afterAll} from '@jest/globals';


import app from '../../../index';
import request from 'supertest';

import Campaigns from '../../../models/Campaigns';
import SessionsModel from '../../../models/SessionsModel';
import YouTubeService from '../../../services/YouTubeService';

import generateToken from '../../../utils/jwtHelper';
const createToken = generateToken({email: 'samcbride11@gmail.com'}, false);


jest.mock('../../../models/Campaigns');
jest.mock('../../../models/SessionsModel');
jest.mock('../../../services/YouTubeService');

const mockedYouTube = new YouTubeService as jest.Mocked<YouTubeService>;
const mockedCampaigns = new Campaigns() as jest.Mocked<Campaigns>;
const mockedSessionsModel = new SessionsModel() as jest.Mocked<SessionsModel>;



jest.mock('../../../db');

beforeEach(() => {
  // server = app.listen(3001);
  jest.clearAllMocks();
})


describe('/campaign/add/ routes', () => {
  test('Submits missing data in request, returns 400 error', async () => {
    const response = await request(app)
    .post('/campaign/add/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}`)
    .set('SessionKey', '5000')
    .send('videoLink=youtube.com/test&plan=');

    expect(response.status).toBe(400);
  })
  test('Return 400 for invalid youtube link', async() => {
    mockedYouTube.validateVideoLink.mockRejectedValueOnce({error: 'Error'});

    const response = await request(app)
    .post('/campaign/add/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}`)
    .set('SessionKey', '5000')
    .send('videoLink=youtube.com/test&plan=');
    
    expect(response.status).toBe(400);
    expect(response.body).toEqual({error: "Invalid YouTube URL"});

  })

  test('Return 400 error for plan name not part of plans', async () => {
    const response = await request(app)
    .post('/campaign/add/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}`)
    .set('SessionKey', '5000')
    .send('videoLink=youtube.com/test&plan=Main');

    expect(response.status).toBe(400);
  })

  test('Return 201 code for valid data', async () => {
    
    mockedSessionsModel.getSession.mockResolvedValueOnce({error: "", session: null});
    mockedSessionsModel.addSession.mockResolvedValueOnce({created: true, identifier: '5000', error: ""});

    mockedCampaigns.addCampaign.mockResolvedValueOnce({campaign_id: 5, error: ""})
    .mockResolvedValueOnce({campaign_id: 5, error: ""});

    const response = await request(app)
    .post('/campaign/add/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}`)
    .set('SessionKey', '5000')
    .send('videoLink=https://www.youtube.com/watch?v=p9zbWiBhsTc&plan=Premium');

    console.log(response.body);
    
    expect(mockedYouTube.validateVideoLink).toHaveBeenCalledTimes(1);
    expect(mockedCampaigns.addCampaign).toHaveBeenCalledTimes(1);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({campaignId: 5, message: "Campaign added" })
  });

  test(' handles error for missing session key', async() => {
    const response = await request(app).post('/campaign/add')
    .type('form').set('Authorization', `Bearer ${createToken.accessToken}`)
    .send('videoLink=https://www.youtube.com/watch?v=p9zbWiBhsTc&plan=Premium');

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({error: 'Missing session key'});

  });

  test(' handles duplicate from getSession', async() => {
    mockedSessionsModel.getSession.mockResolvedValueOnce({error: "", session: {}});
    

    const response = await request(app).post('/campaign/add/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}`)
    .set('SessionKey', '5000')
    .send('videoLink=https://www.youtube.com/watch?v=p9zbWiBhsTc&plan=Premium');

    expect(mockedSessionsModel.getSession).toHaveBeenCalledTimes(1);
    expect(mockedSessionsModel.getSession).toHaveBeenNthCalledWith(1, '5000', 'ADD_CAMPAIGN');

    expect(response.status).toEqual(409);
    expect(response.body).toEqual({error: 'Duplicate request, start a new action to complete'});
  })

  test(' handles error from getSession', async() => {
    mockedSessionsModel.getSession.mockResolvedValueOnce({error: "Error", session:null});

    const response = await request(app).post('/campaign/add/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}`)
    .set('SessionKey', '5000')
    .send('videoLink=https://www.youtube.com/watch?v=p9zbWiBhsTc&plan=Premium');

    expect(mockedSessionsModel.getSession).toHaveBeenCalledTimes(1);
    expect(mockedSessionsModel.getSession).toHaveBeenNthCalledWith(1, '5000', 'ADD_CAMPAIGN');

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({error: 'Error looking up session'});

  })

  test('handles duplicate during addSession', async() => {
    mockedSessionsModel.getSession.mockResolvedValueOnce({error: "", session: null});
    mockedSessionsModel.addSession.mockResolvedValueOnce({created: false, identifier: null, error: "Duplicate"});

    const response = await request(app).post('/campaign/add/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}`)
    .set('SessionKey', '5000')
    .send('videoLink=https://www.youtube.com/watch?v=p9zbWiBhsTc&plan=Premium');

    expect(mockedSessionsModel.getSession).toHaveBeenCalledTimes(1);
    expect(mockedSessionsModel.getSession).toHaveBeenNthCalledWith(1, '5000', 'ADD_CAMPAIGN');

    expect(mockedSessionsModel.addSession).toHaveBeenCalledTimes(1);
    expect(mockedSessionsModel.addSession).toHaveBeenNthCalledWith(1, '5000', 'ADD_CAMPAIGN');

    expect(response.status).toEqual(409);
    expect(response.body).toEqual({error: 'Duplicate request, start a new action to complete'});

  })

  test('handles unknown error from addSession', async() => {
    mockedSessionsModel.getSession.mockResolvedValueOnce({error: "", session: null});
    mockedSessionsModel.addSession.mockResolvedValueOnce({created: false, identifier: null, error: "Other"});

    const response = await request(app).post('/campaign/add/')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}`)
    .set('SessionKey', '5000')
    .send('videoLink=https://www.youtube.com/watch?v=p9zbWiBhsTc&plan=Premium');

    expect(mockedSessionsModel.getSession).toHaveBeenCalledTimes(1);
    expect(mockedSessionsModel.getSession).toHaveBeenNthCalledWith(1, '5000', 'ADD_CAMPAIGN');

    expect(mockedSessionsModel.addSession).toHaveBeenCalledTimes(1);
    expect(mockedSessionsModel.addSession).toHaveBeenNthCalledWith(1, '5000', 'ADD_CAMPAIGN');

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({error: 'Error creating campaign, try again'});

  })

})