//SessionsModel.ts tests

import {jest, describe, test, beforeEach, expect} from '@jest/globals';
import {query} from '../../db';

import SessionsModel from '../SessionsModel';

jest.mock('../../db');


const queryMock = query as jest.Mock;


describe('Sessions Model tests: ', () => {
  let sessionsModel: SessionsModel;

  beforeEach(() => {
    sessionsModel = new SessionsModel();
    jest.resetAllMocks();
  });

  test('getSession returns error for invalid operation type', async() => {
    
    const result = await sessionsModel.getSession('15226559', 'ADD_SUBSCRIPTION');
    console.log(result);

    expect(result).toEqual({session: null, error: 'Invalid_Operation'});

  });

  test('getSession returns session if it exists', async() => {
    queryMock.mockResolvedValueOnce({rows: [ {idempotency_key: '5005', status: 'PENDING' }]});

    const result = await sessionsModel.getSession('5005', 'CREATE_PAYMENT');

    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(queryMock).toHaveBeenNthCalledWith(1, expect.stringContaining('SELECT * FROM sessions'),
     ['CREATE_PAYMENT', '5005']);

    expect(result.session).toEqual({idempotency_key: '5005', status: 'PENDING'});
    expect(result.error).toBeFalsy();

  })

  test('getSession handles query error with expected return value', async () => {
    queryMock.mockRejectedValueOnce({message: 'Query error'});

    const result = await sessionsModel.getSession('5005', 'CREATE_PAYMENT');

    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(queryMock).toHaveBeenNthCalledWith(1, expect.stringContaining('SELECT * FROM sessions'),
     ['CREATE_PAYMENT', '5005']);

    expect(result).toEqual({session: null, error: 'Query error'});

  });

  test('getSession returns expected value if no session is found', async() =>{
    queryMock.mockResolvedValueOnce({rows:[]});

    const result = await sessionsModel.getSession('5005', 'CREATE_PAYMENT');

    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(queryMock).toHaveBeenNthCalledWith(1, expect.stringContaining('SELECT * FROM sessions'),
     ['CREATE_PAYMENT', '5005']);

    expect(result).toEqual({session: null, error: ""});

  });

  test('addSession returns expected value for invalid operationType', async() => {
    const result = await sessionsModel.addSession('5005', 'ADD_ORDER');

    expect(result).toEqual({created: false, identifier: null, error: 'Invalid_Operation'});

  });

  test('addSession returns expected value and calls query for inserting new session', async() => {
    queryMock.mockResolvedValueOnce({})
    .mockResolvedValueOnce({rows: []})
    .mockReturnValueOnce({});

    const result = await sessionsModel.addSession('5005', 'CREATE_PAYMENT');

    expect(queryMock).toHaveBeenCalledTimes(3);
    expect(queryMock).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(queryMock).toHaveBeenNthCalledWith(2, expect.stringContaining('INSERT INTO sessions'),
    [ '5005', 'CREATE_PAYMENT']);
    expect(queryMock).toHaveBeenNthCalledWith(3, 'COMMIT');

    expect(result).toEqual({created: true, identifier: '5005', error: "" });

  })

  test('addSession returns expected value for unique constraint violation', async() => {
    queryMock.mockResolvedValueOnce({})
    .mockRejectedValueOnce({type: '23505'})
    .mockResolvedValueOnce({});

    const result = await sessionsModel.addSession('5005', 'CREATE_PAYMENT');
    expect(queryMock).toHaveBeenCalledTimes(3);
    expect(queryMock).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(queryMock).toHaveBeenNthCalledWith(2, expect.stringContaining('INSERT INTO sessions'),
    [ '5005', 'CREATE_PAYMENT']);
    expect(queryMock).toHaveBeenNthCalledWith(3, 'ROLLBACK');

    expect(result).toEqual({created: false, identifier: null, error: "Duplicate" });

  })

  test('addSession returns expected value for other query error', async() => {
    queryMock.mockResolvedValueOnce({})
    .mockRejectedValueOnce({type: '1000'})
    .mockResolvedValueOnce({});

    const result = await sessionsModel.addSession('5005', 'CREATE_PAYMENT');
    expect(queryMock).toHaveBeenCalledTimes(3);
    expect(queryMock).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(queryMock).toHaveBeenNthCalledWith(2, expect.stringContaining('INSERT INTO sessions'),
    [ '5005', 'CREATE_PAYMENT']);
    expect(queryMock).toHaveBeenNthCalledWith(3, 'ROLLBACK');

    expect(result).toEqual({created: false, identifier: null, error: "Unknown" });

  });

  test('updateSession handles error for invalid status type', async() => {
    const result = await sessionsModel.updateSession('50005', 'STOPPED');

    expect(result).toEqual({updated: false, error: 'Invalid_Status'});

  });

  test('updateSession calls expected query and returns object for valid update', async() => {
    queryMock.mockResolvedValueOnce({})
    .mockResolvedValueOnce({}).mockResolvedValueOnce({});

    const result = await sessionsModel.updateSession('500005', 'COMPLETE');

    expect(queryMock).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(queryMock).toHaveBeenNthCalledWith(2, expect.stringContaining('UPDATE sessions SET status')
    , ['COMPLETE', '500005']);
    expect(queryMock).toHaveBeenNthCalledWith(3, 'COMMIT');

    expect(result).toEqual({updated: true, error: null});

  });

  test('updateSession handles query error and returns expected value', async() => {
    queryMock.mockResolvedValueOnce({})
    .mockRejectedValueOnce({message: 'Query error'}).mockResolvedValueOnce({});

    const result = await sessionsModel.updateSession('500005', 'COMPLETE');

    expect(queryMock).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(queryMock).toHaveBeenNthCalledWith(2, expect.stringContaining('UPDATE sessions SET status')
    , ['COMPLETE', '500005']);
    expect(queryMock).toHaveBeenNthCalledWith(3, 'ROLLBACK'); //expect function to rollback on errors during update

    expect(result).toEqual({updated: false, error: 'Query error'});

  });

})