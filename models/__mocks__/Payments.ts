import { jest } from "@jest/globals";

const createPaymentRecord = jest.fn();
const getPaymentByCampaign = jest.fn();
const updateRecord = jest.fn();
const checkPaymentExists = jest.fn();

class Payments {
  createPaymentRecord = createPaymentRecord;
  getPaymentByCampaign = getPaymentByCampaign;
  updateRecord = updateRecord;
  checkPaymentExists = checkPaymentExists;

}

export default Payments;