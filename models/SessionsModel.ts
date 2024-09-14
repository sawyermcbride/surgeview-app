
import { IdealBankElement } from '@stripe/react-stripe-js';
import {query} from '../db';

interface getSessionType {
  session: Record<string, any> | null,
  error: string
}

interface addSessionType {
  created: boolean, 
  identifier: string | null,
  error: string
}

class SessionsModel {

  public validOperationTypes: Array<string> = ['ADD_CAMPAIGN', 'DELETE_CAMPAIGN', 'UPDATE_CAMPAIGN', 'CREATE_PAYMENT', 'CONFIRM_PAYMENT'];

  /**
   * Gets a session based on unique key and action type
   * @param {String} indentifier the unique idempotency key received from the client in the request
   * @param {String }operationType one of ['ADD_CAMPAIGN', 'DELETE_CAMPAIGN', 'UPDATE_CAMPAIGN', 'CREATE_PAYMENT', 'CONFIRM_PAYMENT']
   * based on the nature of the request
   * @returns {getSessionType} object containing the session record if found otherwise null
   */


  public async getSession(identifier: string, operationType: string): Promise<getSessionType> {

    if( !(this.validOperationTypes.includes(operationType)) ) {
      return {session: null, error: 'Invalid_Operation'};
    }

    try {

      const result = await query('SELECT * FROM sessions WHERE operation_type = $1 AND idempotency_key = $2',
         [operationType, identifier]);

      if(result.rows.length > 0) {
        return {session: result.rows[0], error: ""};
      } else {
        return {session: null, error: ""};
      }

    } catch(error) {
      return {session: null, error: error.message};
    }

  }

  /**
   * Adds a new session
   * @param {String} identifier  the unique identifier recieved from the client
   * @param {String} operationType 
   * @returns {addSessionType} error types include 'Invalid_Operation' and 'Duplicate' or 'Unknown' for others
   * - {created: true, identifier, error: ""} identifer is null for error
   */
  public async addSession(identifier: string, operationType: string): Promise<addSessionType> {

    if( !(this.validOperationTypes.includes(operationType)) ) {
      return {created: false, identifier: null, error: 'Invalid_Operation'};
    }

    try {
      await query('BEGIN');
      await query(`INSERT INTO sessions (idempotency_key, operation_type, expires_at)
      VALUES($1, $2, NOW() + INTERVAL '24 hours');`, [identifier, operationType]);
      
      await query('COMMIT');
      
      return {created: true, identifier, error: "" };
    } catch(error) {

      await query('ROLLBACK');

      if(error.type === '23505') {
        return {created: false, identifier: null, error: "Duplicate" };
      } else {
        return {created: false, identifier: null, error: "Unknown" }
      }
    }

  }
}

export default SessionsModel;