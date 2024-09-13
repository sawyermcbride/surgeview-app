import {jest} from '@jest/globals';

const login = jest.fn();
const createCustomer = jest.fn();
const getStripeId = jest.fn();
const setStripeId = jest.fn();
const checkCampaignBelongs = jest.fn();

class Customers {
  login = login
  createCustomer = createCustomer;
  getStripeId = getStripeId;
  setStripeId = setStripeId;
  checkCampaignBelongs = checkCampaignBelongs;
}

export default Customers