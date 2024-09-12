import {jest, describe, expect, test, beforeEach} from '@jest/globals';

import {query, testConnection} from '../../../db';
import YouTubeService from '../../../services/YouTubeService';
import Campaigns from '../../../models/Campaigns';

import app from '../../../index';
import request from 'supertest';

import generateToken from '../../../utils/jwtHelper';

const createToken = generateToken({email: 'samcbride11@gmail.com'}, false);

jest.mock('../../../models/Campaigns');
jest.mock('../../../services/YouTubeService');


const mockedYouTube = new YouTubeService() as jest.Mocked<YouTubeService>
const mockedCampaigns = new Campaigns() as jest.Mocked<Campaigns>;

mockedCampaigns.updateColumns.mockResolvedValue({ updated: true, error: null });
mockedYouTube.validateVideoLink.mockResolvedValue({valid: true, channelTitle: "title", title: "title"});


jest.mock('../../../db', () => ({
  query: jest.fn(),
  testConnection: jest.fn()
}));

beforeEach(() => {

  jest.clearAllMocks();
})

describe('Update campaign routes', () => {
  test('should verify Campaigns and YouTubeService methods are mocked and called', async () => {
    // Call a function in your actual test
    await mockedCampaigns.updateColumns(1, { status: 'stopped' }, 'test@example.com');
    await mockedYouTube.validateVideoLink('https://youtube.com/watch?v=abcd1234');

    // Assertions to ensure the mocks are called
    expect(mockedCampaigns.updateColumns).toHaveBeenCalled();
    expect(mockedCampaigns.updateColumns).toHaveBeenCalledWith(1, { status: 'stopped' }, 'test@example.com');

    expect(mockedYouTube.validateVideoLink).toHaveBeenCalled();
    expect(mockedYouTube.validateVideoLink).toHaveBeenCalledWith('https://youtube.com/watch?v=abcd1234');
  });


  test('returns status 400 for no data in request', async() => {
    

    const response = await request(app)
    .put('/campaign/update/50')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}`)
    .send('');

    expect(response.status).toBe(400);    
    expect(response.body).toEqual({message: 'No data to update submitted'});
  })

  test('returns status 400 for unmatched plan name', async () => {
    const response = await request(app)
    .put('/campaign/update/50')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}`)
    .send('video_link=&plan_name=Test');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({error: "Missing required fields"});    
  });

  test('returns status 500 for error in calling updateColums', async () => {
    mockedCampaigns.updateColumns.mockResolvedValue({ updated: false, error: "error" });

    const response = await request(app)
    .put('/campaign/update/50')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}`)
    .send('video_link=https://www.youtube.com/watch?v=p9zbWiBhsTc&plan_name=Premium');
    
    expect(response.status).toBe(500);    
  })
  
  
  test('Expect response of 200 for updating video link', async () => {
    mockedCampaigns.updateColumns.mockResolvedValue({ updated: true, error: "" });
    mockedYouTube.validateVideoLink.mockResolvedValue(
      {valid: true, title: "title", channelTitle: "titile"}
    );

    const response = await request(app)
    .put('/campaign/update/50')
    .type('form')
    .set('Authorization', `Bearer ${createToken.accessToken}`)
    .send('video_link=https://www.youtube.com/watch?v=p9zbWiBhsTc&plan_name=Premium');
    
    console.log(YouTubeService.prototype.validateVideoLink);


    expect(mockedCampaigns.updateColumns).toHaveBeenCalled();
    expect(mockedYouTube.validateVideoLink).toHaveBeenCalled();
    expect(response.status).toBe(200);
  })

})