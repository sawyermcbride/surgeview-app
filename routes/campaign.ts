import express, { Request, Response, NextFunction } from "express";

import { query } from "../db";

import StatisticsService from "../services/StatisticsService";
import { deleteCampaign } from "./campaign/deleteCampaign";
import { addCampaign } from "./campaign/addCampaign";
import { updateCampaign } from "./campaign/updateCampaign";

import Campaigns from "../models/Campaigns";

const router = express.Router();
const statisticsService = new StatisticsService();
const campaigns = new Campaigns();


router.use( (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

router.delete('/delete/:campaignId', deleteCampaign);

router.post("/add", addCampaign);

router.get("/request", async (req: Request, res: Response) => {

  if(!req.user) {
    return res.status(401).json({message: "User not authorized"});
  }

  const userEmail = req.user.email;
  try {

      const result = await campaigns.getCampaigns(userEmail);
      
      if(!result.error) {
        console.log("No error, returning 200 status");
        return res.status(200).json(result.campaigns);
      } else {
        throw new Error(result.error);
      }

  } catch(err) {
    return res.status(500).json({message: "Error loading campaigns"});
  }
})

router.put("/update/:id", updateCampaign);


router.get("/statistics", async(req: Request, res: Response) => {
  
  if(!req.user) {
    return res.status(401);
  }

  const statisticsInfo = await statisticsService.getBaseStatisics(req.user.email);


  if(statisticsInfo.errors.length === 0 && statisticsInfo.statistics && statisticsInfo.status) {
    return res.status(200).json(statisticsInfo );
  } else {
    return res.status(500).json(statisticsInfo);
  }

});


export default router;
