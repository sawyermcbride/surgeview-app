import {query} from '../db';
import bcrypt from "bcrypt";
import generateToken from '../utils/jwtHelper';

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

  public async createCustomer(email: string, password: string) {
    const saltrounds = 10;

    try {
      const hashedPassword = await bcrypt.hash(password, saltrounds);
  
      const checkUserResult = await query(
        "SELECT id FROM customers WHERE email = $1",
        [email],
      );
      if (checkUserResult.rows.length > 0) {
        return {created: false, type: 'duplicate',  message: 'Email already in use.'}
      }
  
      const result = await query(
        "INSERT INTO customers (email, password) VALUES($1, $2) RETURNING id, email, created_at",
        [email, hashedPassword],
      );

      return {created: true, email: result.rows[0].email}
    } catch(error) {
      return {created: false, error: true, type: 'unknown', message: error.message}
    }


  }
}

export default Customers;