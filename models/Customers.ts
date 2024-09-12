import {query} from '../db';
import bcrypt from "bcrypt";
import generateToken from '../utils/jwtHelper';

interface LoginResponse {
  login: boolean;
  errorType: 'user' | 'password' | 'other';
  errorMessage: string;
  email: string;
}

class Customers {
  public async checkCampaignBelongs(email: string, campaignId: number): Promise<boolean> {
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
      await query('BEGIN');
      const hashedPassword = await bcrypt.hash(password, saltrounds);
  
      const checkUserResult = await query(
        "SELECT id FROM customers WHERE email = $1",
        [email],
      );
      console.log('checkUserResult', checkUserResult);
      if (checkUserResult.rows.length > 0) {
        return {created: false, type: 'duplicate',  message: 'Email already in use.'}
      }
  
      const result = await query(
        "INSERT INTO customers (email, password) VALUES($1, $2) RETURNING id, email, created_at",
        [email, hashedPassword],
      );

      await query('COMMIT');
      console.log('Result in Customers', result);
      return {created: true, error: false, email: result.rows[0].email}
    } catch(error) {
      await query('ROLLBACK');
      return {created: false, error: true, type: 'unknown', message: error.message}
    }
  }
/**
 *  Determine if the user email and password belong to a valid user to issue them a token
 * @param email 
 * @param password 
 * @returns {Object}
 * - login: boolean - Indicates if the login was successful
 * - errorType: 'user' | 'password' | 'other' provides the error type
 * - errorMessage: string - Provides details about the error, empty if none
 * - email: string - Returns the email is the login was successful, empty if none
 */
  public async login(email: string, password: string): Promise<LoginResponse> {
    try {
      await query('BEGIN');

      const result = await query("SELECT * FROM customers WHERE email = $1", [
        email,
      ]);

      await query('COMMIT');
  
      if (result.rows.length === 0) {
        return {
          login: false,
          errorType: "user",
          errorMessage: "",
          email: ""
        }
      }
  
      const hashedPassword = result.rows[0].password;
  
      const isMatch = await bcrypt.compare(password, hashedPassword);

      if (isMatch) {
        return {
          login: true, 
          errorType: "",
          errorMessage: "",
          email
        }
      } else {
        return {
          login: false, 
          errorType: "password",
          errorMessage: "Invalid password",
          email: ""
        }

      }

    } catch(error) {
      await query('ROLLBACK');
      return {
        login: false,
        errorType: "other",
        errorMessage: error.message,
        email: ""
      }
    }
  }
  /**
   * Gets the customer stripe id, returns "" if none 
   * @params {string} Email
   * @returns {{customer_id: string, error: string}}
   */
  public async getStripeId(email: string ): Promise<{customer_id: string, error: string}> {
    try {
      const result = await query('SELECT stripe_customer_id FROM customers WHERE email = $1', [email]);

      return {
        customer_id: result.rows[0].stripe_customer_id || "",
        error: ""
      }

    } catch(error) {
      return {
        customer_id: "",
        error: error.message
      }
    }
  }

  public async setStripeId(email: string, customer_id: string): Promise<{updated: boolean, error: string}> {
    try {
      const result = await query('UPDATE customers SET stripe_customer_id = $1 WHERE email = $2', 
        [customer_id, email]);

        console.log(result);

        if((result.rowCount ?? 0) > 0) {
          return {
            updated: true, 
            error: ""
          }
        }

        return {
          updated: false,
          error: "Customer not found"
        }
      
    } catch(error) {
      return {
        updated: false, 
        error: error.message
      }
    }
  }

}

export default Customers;