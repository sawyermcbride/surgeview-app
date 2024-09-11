//Campaigns.ts service 

import {query} from "../db";

interface AddCampaignObject {
  video_link: string,
  price: number, 
  plan_name: string, 
  video_title: string,
  channel_title: string
}

class Campaigns {

  public validColumns: string[] = ['plan_name', 'price', 'plan_name', 'video_link', 'google_campaign_id',
    'google_ad_group_id', 'google_ad_id', 'status', 'channel_title', 'video_title', 'payment_status'];
  /**
   * Checks if a campaign exists by id 
   * @param id  campaign id
   * @returns 
   */
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
          error: "",
          exists: true,
          campaigns: result.rows
        }
      }

    } catch(error) {
      return {
        exists: false,
        campaigns: [], 
        error: error
      }
    }
  }
  public async updatePaymentStatus(id: number, newStatus: string, email: string): Promise<{
    updated: boolean, error: string
  }> {
    try {
      await query('BEGIN');

      console.log(`updatePaymentStatus, id type = ${typeof id} value = ${id}`);;

      const result = await query(`UPDATE campaigns SET payment_status = $1 FROM customers WHERE
        campaigns.customer_id = customers.id AND campaigns.campaign_id = $2 AND 
        customers.email = $3;`, [newStatus, id, email]);

      

      await query('COMMIT');

      if(result.rowCount === 0) {
        throw new Error('No campaign found or email mismatch');
      }


      return {
        updated: true, 
        error: ""
      }

    } catch(error) {
      console.log(error);
      await query('ROLLBACK');
      return {
        updated: false,
        error
      }
    }

  }
  /**
   * Gets all the campaigns associated with a user 
   * @param {string} email email used to access campaigns so ensure it is from req.user for authentication 
   * @returns object with error property (empty string if none) and campaigns property an array of campaign rows
   */

  public async getCampaigns(email: string) {
    try {
      const result = await query(`SELECT ca.campaign_id, ca.video_link, ca.price, ca.plan_name, ca.status, ca.video_title, 
      ca.channel_title, ca.payment_status FROM campaigns AS ca 
      JOIN customers AS cus ON ca.customer_id = cus.id WHERE email = $1`, [email]);

      return {
        error:"",
        campaigns: result.rows
      }

    } catch(error) {
      return {
        result: [],
        error: error.message,
      }
    }
  }
  /**
   * 
   * @param {object} addData Object including (video_link, price, plan_name,
         video_title, channel_title) to insert to the database
   * @param {string} email from the req.user object to ensure access
   * @returns {Promise<{campaign_id: number, error: string}>}  - campaign_id of created campaign, is -1 if not created, error is empty string if no error
   */
  
  public async addCampaign(addData: AddCampaignObject, email: string ): Promise<{campaign_id: number, error: string}> {
    const columns = Object.keys(addData);
    console.log(addData);
    for(const column of columns) {
      if(! (this.validColumns.includes(column))) {
        throw new Error(`Invalid column ${column}`);
      }
    }

    try {
      await query('BEGIN');
      
      const customerId = await query(
        "SELECT ID FROM customers WHERE email = $1",
        [email],
      );

      const result = await query(
        `INSERT INTO campaigns (customer_id, video_link, price, plan_name,
         video_title, channel_title, status, payment_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING campaign_id`,
        [customerId.rows[0].id, addData.video_link, addData.price, addData.plan_name, addData.video_title,
         addData.channel_title, 'setup', 'not_attempted'],
      );

      await query('COMMIT');

      return {
        campaign_id: result.rows[0].campaign_id,
        error: ""
      }

    } catch(error) {
      await query('ROLLBACK');
      return {
        campaign_id: -1,
        error: error.message
      }
    };

  }
  /**
   * 
   * @param {number} campaignId 
   * @param {Record<string, any>} updateData  data to update in the campaigns table
   * @param {string} email - ensure email is from authenticated token 
   * @returns {Promise<{updated: boolean, error: string}>} - A promise resolving to a boolean and error (is empty string if none)
   */

  public async updateColumns(campaignId: number, updateData: Record<string, any> , email: string): 
    Promise<{updated: boolean, error: string }> {

    console.log('Real updateColumns method called');
    const checkCampaign = await this.checkExists(campaignId);
    
    if(!checkCampaign.exists || checkCampaign.error) {
      throw new Error(`Requested campaign to update doesn't exist or an error occured: 
        ${checkCampaign.errorMessage || ''}`);
    }

    const columns = Object.keys(updateData);

    for(const column of columns) {
      if(! (this.validColumns.includes(column))) {
        throw new Error(`Invalid column ${column}`);
      }
    }

    try {
      await query('BEGIN');

      //create set clauses, will look like this: 'plan_name = $1, price = $2' etc
      const setClauses = columns.map((col, idx) => `${col} = $${idx + 1}`).join(', ');


      //create values will look like this: ['Premium', 99.0] etc
      const values = columns.map((col) => updateData[col]);

      const queryText = `UPDATE campaigns SET ${setClauses} WHERE campaign_id = $${columns.length + 1}
        AND customer_id = (SELECT id FROM customers WHERE email = $${columns.length + 2})`;

      const result = await query(queryText, [...values, campaignId, email]);

      await query('COMMIT');
      

        if((result?.rowCount ?? 0)> 0) {
          return {
            updated: true, 
            error: ""
          }
        } else {
        return {
          updated: false, 
          error: "Unable to update campaign, user does not own the campaign or the campaign does not exist"
        }
      }


    } catch(error) {

      return {
        updated: false, 
        error: error.message
      }
    }
  }

}
export default Campaigns;