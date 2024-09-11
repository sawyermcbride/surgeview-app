import { expect, test, jest, beforeAll, beforeEach, describe } from "@jest/globals";

import axios from 'axios';
import YouTubeService from '../YouTubeService';


jest.mock('axios');



describe('YouTubeService', () => {
  let service: YouTubeService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new YouTubeService();
  });

  test('should verify axiosMock.get is defined', () => {
    expect(axios.get).toBeDefined();
    expect(typeof axios.get).toBe('function');
  });


  test('should return video details for a valid video link', async () => {
    const videoLink = 'https://www.youtube.com/watch?v=p9zbWiBhsTc';
    const mockResponse = {
      data: {
        items: [
          {
            snippet: {
              title: 'Mock Title',
              channelTitle: 'Mock Channel',
            },
          },
        ],
      },
    };

    axios.get.mockResolvedValue(mockResponse);


    const result = await service.validateVideoLink(videoLink);

    expect(result).toEqual({
      valid: true,
      title: 'Mock Title',
      channelTitle: 'Mock Channel',
    });
    expect(axios.get).toHaveBeenCalledWith(`https://www.googleapis.com/youtube/v3/videos?id=p9zbWiBhsTc&key=${process.env.YOUTUBE_API_KEY || "AIzaSyCu8EM2Bo6REdjvZ81NZ-S5K7vf6FWr7Bw"}&part=snippet`);
  });

  test('should throw an error for an invalid video link format', async () => {
    const videoLink = 'invalid_link';

    await expect(service.validateVideoLink(videoLink)).rejects.toThrow('Invalid YouTube URL format');
  });

  test('should throw an error if video is not found', async () => {
    const videoLink = 'https://www.youtube.com/watch?v=p9zbWiBhsTc';
    axios.get.mockResolvedValue({ data: { items: [] } });

    await expect(service.validateVideoLink(videoLink)).rejects.toThrow('Invalid YouTube video URL');
  });

  test('should handle axios errors', async () => {
    const videoLink = 'https://www.youtube.com/watch?v=p9zbWiBhsTc';
    axios.get.mockRejectedValue(new Error('Network Error'));

    await expect(service.validateVideoLink(videoLink)).rejects.toThrow('Invalid YouTube video URL');
  });
});