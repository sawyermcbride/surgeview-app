//Campaigns.ts service 

import {query} from "../db";

class Campaigns {

  public validColumns: string[] = ['plan_name', 'price', 'plan_name', 'video_link', 'google_campaign_id',
    'google_ad_group_id', 'google_ad_id', 'status', 'channel_title', 'video_title', 'payment_status'];

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
  public async updatePaymentStatus(id: number, newStatus: string, email: string) {
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

  public async getColumns(campaignId: number, email: string) {
    try {
      const result = await query(`SELECT * FROM campaigns AS ca JOIN customers AS cus
      ON ca.customer_id = cus.id WHERE email = $1 AND ca.campaign_id = $2`, [email, campaignId]);

        return {
          error: false,
          result
        }

    } catch(error) {
      return {
        error: true,
        message: error.message,
      }
    }
  }

  public async updateColumns(campaignId: number, updateData: Record<string, any> , email: string) {

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

      await query(queryText, [...values, campaignId, email]);

      await query('COMMIT');

      return {
        updated: true
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