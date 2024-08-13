import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { query } from "../db";
import generateToken from "../utils/jwtHelper";

const router = Router();
const saltrounds = 10;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validatePassword = (password: string): boolean => {
  return password.length >= 6 && password.length < 50;
};

router.post("/", async (req: Request, res: Response) => {
  let { email, password } = req.body;
  console.log(req.body);

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
      error: "Password invalid",
      password,
    });
  }

  email = email.toLowerCase()

  try {
    const hashedPassword = await bcrypt.hash(password, saltrounds);

    const checkUserResult = await query(
      "SELECT id FROM customers WHERE email = $1",
      [email],
    );
    if (checkUserResult.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    const result = await query(
      "INSERT INTO customers (email, password) VALUES($1, $2) RETURNING id, email, created_at",
      [email, hashedPassword],
    );

    const token = generateToken({
      email: result.rows[0].email,
    });

    res.status(201).json({ message: "User registered succesfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering user" });
  }
});

router.get("/", (req: Request, res: Response) => {
  res.send("GET /Signup Recieved");
});

export default router;
