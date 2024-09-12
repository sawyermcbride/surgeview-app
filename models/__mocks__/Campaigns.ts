import { jest } from "@jest/globals";

const updateColumns = jest.fn().mockResolvedValue({ updated: true, error: null });
const addCampaign = jest.fn();
const getCampaigns = jest.fn();

class Campaigns {
  updateColumns = updateColumns;
  addCampaign = addCampaign;
  getCampaigns = getCampaigns;
}

export default Campaigns;