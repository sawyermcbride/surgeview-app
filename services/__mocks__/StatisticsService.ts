import {jest} from '@jest/globals'

const getBaseStatisics = jest.fn();
class StatisticsService {
  getBaseStatisics = getBaseStatisics;
}

export default StatisticsService;