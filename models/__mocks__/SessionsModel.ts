import { jest } from "@jest/globals";

const addSession = jest.fn();
const getSession = jest.fn();


class SessionsModel {
  addSession = addSession;
  getSession = getSession;

}

export default SessionsModel;