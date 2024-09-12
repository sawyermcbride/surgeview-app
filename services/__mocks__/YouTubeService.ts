import { jest } from "@jest/globals";

const validateVideoLink = jest.fn().mockResolvedValue({
  valid: true,
  channelTitle: "mocked channel",
  title: "mocked title"
});

class YouTubeService {
  validateVideoLink = validateVideoLink
}

export default YouTubeService;