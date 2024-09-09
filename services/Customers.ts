import {query} from '../db';


class Customers {
  public async checkCampaignBelongs(email: string, campaignId: number) {
    try {
      const result = await query(`SELECT email, campaign_id, customer_id FROM campaigns JOIN customers ON 
                                  customers.id = campaigns.customer_id WHERE campaign_id = $1 AND email = $2`, 
                                  [campaignId, email]);
      
      if(result.rows.length > 0) {
        return true;
      } else {
        return false;
      }
      
    } catch(error) {
      console.log(error);
      return false;
    } 
  }
}

export default Customers;