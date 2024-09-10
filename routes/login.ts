import express, { Request, Response } from "express";
import generateToken from "../utils/jwtHelper";

import Customers from "../models/Customers";

const router = express.Router();

const customers = new Customers();

router.post("/", async (req: Request, res: Response) => {

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  const result = await customers.login(email, password);

  if(result.login) {
    const {accessToken, refreshToken} = generateToken({email: result.email}, true)
    console.log(accessToken);

    res.status(200).json({token: accessToken, refreshToken});
  } else if(result.errorType === 'user') {
    res.status(400).json({message: "No user exists with that email", type: result.errorType});
  } else if(result.errorType === 'password') {
    res.status(401).json({message: "Password invalid", type: result.errorType});
  } else {
    res.status(500).json({message: "Error occured during login"});
  }

});

export default router;
