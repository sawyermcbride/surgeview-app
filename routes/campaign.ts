import express, { Request, Response, NextFunction } from "express";
import { expressjwt as jwt } from "express-jwt";
import { query } from "../db";

const router = express.Router();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}
router.post("/add", async (req: Request, res: Response) => {
  console.log("/campaign/add");
  const { videoLink, plan } = req.body;

  if (!videoLink || !plan) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const userEmail = req.user.email;
    const startDate = new Date();
    const endDate = new Date(startDate);

    endDate.setDate(startDate.getDate() + 30);

    const customerID = await query(
      "SELECT ID FROM customers WHERE email = $1",
      [userEmail],
    );
    console.log(customerID.rows[0].id);

    await query("BEGIN");
    await query(
      "INSERT INTO campaigns (customer_id, video_link, start_date, end_date, price, plan_name) VALUES ($1, $2, $3, $4, $5, $6)",
      [customerID.rows[0].id, videoLink, startDate, endDate, 99.0, plan],
    );

    await query("COMMIT");

    res.status(201).json({ message: "end" });
  } catch (err) {
    await query("ROLLBACK");
    res.status(500).json({ message: "Error adding campaign", err });
  }
});

export default router;
