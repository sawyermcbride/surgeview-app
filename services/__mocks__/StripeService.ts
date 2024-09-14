
import { jest } from "@jest/globals";

const createSubscription = jest.fn();
const createCustomer = jest.fn();
const getCustomer = jest.fn();

class StripeService {
  createSubscription = createSubscription;
  createCustomer = createCustomer;
  getCustomer = getCustomer;
}

export default StripeService;