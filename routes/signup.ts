import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { query } from "../db";
import jwt from "jsonwebtoken";
import generateToken from "../utils/jwtHelper";
import Customers from "../models/Customers";


const customers = new Customers();

const router = Router();
const saltrounds = 10;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validatePassword = (password: string): boolean => {

  const minLength = 8;
  const maxLength = 50;

  // Check length
  if (password.length < minLength || password.length > maxLength) {
    return false;
  }

  // Check for at least one uppercase letter
  const hasUppercase = /[A-Z]/.test(password);
  
  // Check for at least one lowercase letter
  const hasLowercase = /[a-z]/.test(password);
  
  return hasUppercase && hasLowercase;
};

router.post("/", async (req: Request, res: Response) => {
  let { email, password } = req.body;

  //validate email
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      error: "Invalid email format",
      email,
    });
  }
  //validate password
  if (!password || !validatePassword(password)) {
    return res.status(400).json({
      error: "Password format invalid",
      password,
    });
  }

  email = email.toLowerCase()

  try {
    
    const newCustomer = await customers.createCustomer(email, password);
    
    if(!newCustomer?.created) {
      if(newCustomer?.error === 'duplicate') {
        return res.status(409).json({message: newCustomer.message});
      } else {
        throw new Error();
      }
    }

    const {accessToken, refreshToken} = generateToken({email: newCustomer.email}, true);

    res.status(201).json({ message: "User registered succesfully", token: accessToken, refreshToken});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering user" });
  }
});


export default router;
