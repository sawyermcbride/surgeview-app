import express, { Request, Response, NextFunction } from "express";
import { expressjwt as jwt } from "express-jwt";
import { query } from "../db";
import { emit } from "process";

const router = express.Router();


router.use( (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

router.post("/add", async (req: Request, res: Response) => {
  
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

    res.status(201).json({ message: "Campaign added" });
  } catch (err) {
    await query("ROLLBACK");
    res.status(500).json({ message: "Error adding campaign", err });
  }
});

router.get("/request", async (req: Request, res: Response) => {

  try{
    if(!req.user) {
      return res.status(401).json({message: "User not authorized"});
    } else {
      const userEmail = req.user.email;
      const result = await query("SELECT id FROM customers WHERE email= $1", [userEmail]);

      const customer_id = result.rows[0].id;

      const campaigns_result = await query("SELECT * FROM campaigns WHERE customer_id = $1", [customer_id]);
      return res.status(200).json(campaigns_result.rows);
    }



  } catch(err) {
    return res.status(500).json({message: "Error loading campaigns"});
  }
})

router.put("/update/:id", async (req: Request, res: Response) => {
  const updateFields = ['video_link', 'plan_name'];

  let videoId = req.params.id; 
  let updateData = req.body;

  console.log(updateData);
  
  try {
    if(!req.user.email) {
      return res.status(401).json({message: "User not authorized"});
    } else {
    
      console.log(req.user.email);
      let result = await query(`SELECT customers.email, campaigns.campaign_id, campaigns.video_link, campaigns.plan_name
        FROM customers JOIN campaigns ON customers.id = campaigns.customer_id
        WHERE email = $1 AND campaigns.campaign_id = $2`, [req.user.email, videoId]);

      for (const elem of updateFields) {
          // console.log(`result.rows[0][elem] = ${result.rows[0][elem]} and updateData[elem] = ${updateData[elem]} and elem = ${elem}`);
        if(updateData[elem] && updateData[elem] !== result.rows[0][elem]) {
          const queryText = `UPDATE campaigns SET ${elem} = $1 WHERE campaign_id = $2`;
          await query(queryText, [updateData[elem], videoId]);  
        }
      }
      return res.status(200).json({message: "Campaign updated"});
    };
  } catch(err) {
      return res.status(500).json({message: err});
  }

});


export default router;
