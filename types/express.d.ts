import {Request} from "express";

declare global {
  namespace Express {
    export interface User {
      email: string;
    }

    export interface Request {
      user?: User;
    }
  } 
}