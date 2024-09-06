import express, { Request, Response, NextFunction } from "express";

import { query } from "../db";

import StatisticsService from "../services/StatisticsService";
import { deleteCampaign } from "./campaign/deleteCampaign";
import { addCampaign } from "./campaign/addCampaign";
import { updateCampaign } from "./campaign/updateCampaign";


const router = express.Router();
const statisticsService = new StatisticsService();


router.use( (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

router.delete('/delete/:campaignId', deleteCampaign);

router.post("/add", addCampaign);



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

router.put("/update/:id", updateCampaign);


router.get("/statistics", async(req: Request, res: Response) => {
  const statisticsJson = await statisticsService.getBaseStatisics(req.user.email);

  return res.status(200).json(statisticsJson );
});


export default router;
