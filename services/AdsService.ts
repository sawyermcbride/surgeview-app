import axios from 'axios';

import { AddCampaignObject } from '../types/ModelTypes';

interface adOperationReturnType {
  complete: boolean;
  message: string | null;
  data?: {status: number}
}

class AdsService {

  private remoteUrl = 'http://localhost:8080';
  private apiKey = 'surgeviewmarketing20252024';

  public async createAd(campaign: AddCampaignObject, id: number): Promise<adOperationReturnType> {
    try {
    
      const response = await axios.put(this.remoteUrl + `/api/campaign/update/${id}`, null, {
        headers: {
          'X-API-KEY': this.apiKey
        }
      });
      
      return {
        complete: true,
        message: null,
        data: {status: response.status}
      }

    } catch(error: any) {

      return {
        complete: false,
        message: error?.response.status
      }

    }
  }


}

export default AdsService;
