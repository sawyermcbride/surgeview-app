//Campaigns.ts service 

import {query} from "../db";

class Campaigns {
  public async checkExists(id: number) {
    try {
      const result = await query(`SELECT * FROM campaigns WHERE campaign_id = $1`, [id]);

      if(result.rows.length === 0) {
        return {
          error: false,
          exists: false
        }
      } else {
        return {
          error: false,
          exists: true,
          campaigns: result.rows
        }
      }

    } catch(error) {
      return {
        error: true,
        errorMessage: error
      }
    }
  }
}

export default Campaigns;