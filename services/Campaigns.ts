//Campaigns.ts service 

import {query} from "../db";

class Campaigns {
  public async checkExists(id: number) {
    const result = await query(`SELECT * FROM campaigns WHERE campaign_id = $1`, [id]);

    if(result.rows.length === 0) {
      return {
        exists: false
      }
    } else {
      return {
        exists: true,
        campaigns: result.rows
      }
    }
  }
}

export default Campaigns;