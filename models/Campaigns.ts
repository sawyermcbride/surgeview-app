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

  public async updateColumns(updateData: object, email: string) {
    const validColumns = []

    try {
      for(let key in updateData) {
        let result = await query(`UPDATE campaigns SET ${key} = $1 WHERE 
        customer_id = (SELECT id FROM customers WHERE email = $2)`, [updateData[key], email]);
      }

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