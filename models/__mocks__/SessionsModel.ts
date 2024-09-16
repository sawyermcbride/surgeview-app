import { jest } from "@jest/globals";

const addSession = jest.fn();
const getSession = jest.fn();
const updateSession = jest.fn();


class SessionsModel {
  addSession = addSession;
  getSession = getSession;
  updateSession = updateSession;

}

export default SessionsModel;