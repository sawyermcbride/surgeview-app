import { jest } from "@jest/globals";

const updateColumns = jest.fn().mockResolvedValue({ updated: true, error: null });

class Campaigns {
  updateColumns = updateColumns;
}

export default Campaigns;