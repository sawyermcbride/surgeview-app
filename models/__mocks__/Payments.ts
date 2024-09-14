import { jest } from "@jest/globals";

const createPaymentRecord = jest.fn();
const checkPaymentExistsByCampaign = jest.fn();
const updateRecord = jest.fn();
const checkPaymentExists = jest.fn();

class Payments {
  createPaymentRecord = createPaymentRecord;
  checkPaymentExistsByCampaign = checkPaymentExistsByCampaign;
  updateRecord = updateRecord;
  checkPaymentExists = checkPaymentExists;

}

export default Payments;