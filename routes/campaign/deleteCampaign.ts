import express, {Request, Response} from "express";
import {query} from '../../db';

export const deleteCampaign = async(req: Request, res: Response) => {
    const campaignId = req.params.campaignId;
  console.log("deleting campaign");
    if(!campaignId) {
        return res.status(400).json({message: "Missing campaign ID"});
    }
    if(!req.user) {
        return res.status(401).json({message: "Missing authentication for deleting campaign."})
    }

    try {
      await query(`UPDATE campaigns SET status='stopped' FROM
                customers WHERE campaigns.customer_id = campaigns.customer_id AND 
                campaigns.campaign_id = $1 AND customers.email = $2;`,
                 [campaignId, req.user.email]);

      return res.status(200).json({message: "Campaign set to stopped"});
                 
    } catch(err) {
        return res.status(500).json({message: err});
    }

}
