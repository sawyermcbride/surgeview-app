import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { query } from "../db";
import jwt from "jsonwebtoken";
import generateToken from "../utils/jwtHelper";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    const result = await query("SELECT * FROM customers WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const hashedPassword = result.rows[0].password;

    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log("Email result in login: ");
    console.log(result.rows[0]);
    if (isMatch) {
      const token = generateToken({
        email: result.rows[0].email,
      });
      console.log(`Successful login by ${email}`, email);
      return res.status(200).json({ message: "Login successful", token });
    } else {
      return res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error during login" });
  }
});

export default router;
