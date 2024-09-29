
import { IdealBankElement } from '@stripe/react-stripe-js';
import {query} from '../db';
import logger from '../utils/logger';

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
  public validStatusTypes: Array<string>  = ['PENDING', 'COMPLETE', 'FAILED'];

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

    } catch(error: any) {
      return {session: null, error: error.message};
    }

  }

  /**
   * @typedef {Object} addSessionType
   * @property {boolean} created - Indicates if the session update was successful.
   * @property {string} identifer - Indicates if the session update was successful.
   * @property {string|null} error - An error message if the update was not successful; `null` if there was no error.
   */


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
      await query(`INSERT INTO sessions (idempotency_key, operation_type, status, expires_at)
      VALUES($1, $2, 'PENDING', NOW() + INTERVAL '24 hours');`, [identifier, operationType]);
      
      await query('COMMIT');
      
      return {created: true, identifier, error: "" };
    } catch(error) {

      await query('ROLLBACK');
      logger.error('Error adding session: ', error.code, error.message);
      if(error.code === '23505') {
        return {created: false, identifier: null, error: "Duplicate" };
      } else {
        return {created: false, identifier: null, error: error.message }
      }
    }

  }

  /**
   * @typedef {Object} UpdateSessionResult
   * @property {boolean} updated - Indicates if the session update was successful.
   * @property {string|null} error - An error message if the update was not successful; `null` if there was no error.
   */

  /**
   * Updates an existing session with a new status
   * @param {string} identifier - Session key from request.
   * @param {string} newStatus - One of ['PENDING', 'COMPLETE', 'FAILED'].
   * @returns {Promise<UpdateSessionResult>} - A promise that resolves to an object with `updated` and `error` properties.
   */
  public async updateSession(identifier: string, newStatus: string, operationType: string): 
  Promise<{updated: boolean, error: string | null}> {
    if(!(this.validStatusTypes.includes(newStatus))) {
      return {updated: false, error: 'Invalid_Status'};
    }

    if(!this.validOperationTypes.includes(operationType)) {
      return {updated: false, error: 'Invalid_Operation'};
    }

    try { 
      await query('BEGIN');
      await query(`UPDATE sessions SET status = $1 WHERE idempotency_key = $2 AND
      operation_type = $3`, [newStatus, identifier, operationType]);
      await query('COMMIT');

      return {updated: true, error: null};

    } catch(error) {
      await query('ROLLBACK');
      return {updated: false, error: error.message};
    }
  }

}

export default SessionsModel;