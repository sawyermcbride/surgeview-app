import { jest } from "@jest/globals";

const updateColumns = jest.fn().mockResolvedValue({ updated: true, error: null });
const addCampaign = jest.fn();
const getCampaigns = jest.fn();
const checkExists = jest.fn();
const checkCampaignBelongs = jest.fn();
const updatePaymentStatus = jest.fn();

class Campaigns {
  updateColumns = updateColumns;
  addCampaign = addCampaign;
  getCampaigns = getCampaigns;
  checkExists = checkExists;
  checkCampaignBelongs = checkCampaignBelongs;
  updatePaymentStatus = updatePaymentStatus;
}

export default Campaigns;