//deleteCampaign.ts

import express, {Request, Response} from "express";
import {query} from '../../db';
import Campaigns from "../../models/Campaigns";

const campaigns = new Campaigns();

export const deleteCampaign = async(req: Request, res: Response) => {
    const campaignId = req.params.campaignId;

    if(!campaignId) {
        return res.status(400).json({message: "Missing campaign ID"});
    }
    if(!req.user) {
        return res.status(401).json({message: "Missing authentication for deleting campaign."})
    }

    try {
    
      const result = await campaigns.updateColumns(parseInt(campaignId), {status: 'stopped'}, req.user?.email);
      console.log(result);
      if(result.updated && !result.error) {
        return res.status(200).json({message: "Campaign set to stopped"});
      } else {
        return res.status(400).json({message: `Unable to update, error: ${result.error || "unknown error"}`}) ;
      }
                 
    } catch(err) {
        return res.status(500).json({message: err});
    }

}
