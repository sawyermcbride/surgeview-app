import express, {Request, Response} from "express";
import YouTubeService from "../../services/YouTubeService";

import Campaigns from "../../models/Campaigns";

const youtubeService = new YouTubeService();
const campaigns = new Campaigns();


const pricingTable = {
  'Standard': 99.0,
  'Premium': 199.0,
  'Pro': 399.0
}


export const addCampaign = async (req: Request, res: Response) => {
    
  const { videoLink, plan } = req.body;
  let videoDetails;
  
  console.log(videoDetails);
  console.log(plan);

  try {
    videoDetails = await youtubeService.validateVideoLink(videoLink);

  } catch(err) {
    
    return res.status(400).json( {error: "Invalid YouTube URL"});
  }

  if (!videoLink || !plan || !(plan in pricingTable) ) {
    console.log('missing required fields');
    return res.status(400).json({ error: "Missing required fields" });
  }


  try {
    const userEmail = req.user?.email;

    const result = await campaigns.addCampaign(
      {
        video_link: videoLink, 
        price: pricingTable[plan],
        plan_name: plan,
        channel_title: videoDetails.channelTitle,
        video_title: videoDetails.title

      },
      userEmail
    );

    if(result.campaign_id > -1 && !result.error) {
      return res.status(201).json({campaignId: result.campaign_id, message: "Campaign added" });
    } else {
      throw new Error(result.error);
    }


  
  } catch (err) {
  
    return res.status(500).json({ message: "Error adding campaign", err });
  }
}