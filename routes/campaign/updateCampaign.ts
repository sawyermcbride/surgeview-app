//updateCampaign controller

import express, {Request, Response} from "express";
import YouTubeService from "../../services/YouTubeService";
import Campaigns from "../../models/Campaigns";

import {query} from '../../db';

const youtubeService = new YouTubeService();
const campaigns = new Campaigns();

const pricingTable: { [key: string]: number} = {
    'Standard': 99.0,
    'Premium': 199.0,
    'Pro': 399.0
}
  

export const updateCampaign = async (req: Request, res: Response) => {
  
    let campaignId = req.params.id; 
    let updateData = req.body;
    let videoDetails = {};
    
    if(Object.keys(updateData).length === 0) {
      return res.status(400).json({message: 'No data to update submitted'});
    }

    if(updateData.video_link)  {
      try {
        videoDetails = await youtubeService.validateVideoLink(updateData.video_link);
  
      } catch(err) {
        return res.status(400).json({error: "Invalid YouTube link"});
      }
  
    }
  
    if(updateData.plan_name && !(updateData.plan_name in pricingTable)) {
      return res.status(400).json({error: "Missing required fields"});
    }

    if(!req.user.email) {
      return res.status(401).json({message: "User not authorized"});
    } 
    
    try {
      
      let dataToUpdate: {[key: string]: any} = {};
      
      if(Object.keys(videoDetails).length > 0) {
        dataToUpdate = {
          ...updateData,
          video_title: videoDetails.title,
          channel_title: videoDetails.channelTitle
        };

        if('plan_name' in dataToUpdate) {
          dataToUpdate['price'] = pricingTable[dataToUpdate.plan_name];
        }
        
      } else {
          
          dataToUpdate = updateData;
        }
        console.log("callign update campaigns");
        
        const result = await campaigns.updateColumns(parseInt(campaignId), dataToUpdate, req.user.email);
        console.log(result);
        if(result.updated && !result?.error) {
          return res.status(200).json({complete: true, message: "Campaign updated"});
        } else {
          throw new Error(result?.error || "Unknown error");
        }

    
    } catch(err) {

        return res.status(500).json({message: err.message});
    }
}