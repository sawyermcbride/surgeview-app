import express, {Request, Response} from "express";
import YouTubeService from "../../services/YouTubeService";

import Campaigns from "../../models/Campaigns";
import SessionsModel from "../../models/SessionsModel";


const youtubeService = new YouTubeService();
const campaigns = new Campaigns();
const sessionsModel = new SessionsModel();

const pricingTable = {
  'Standard': 99.0,
  'Premium': 199.0,
  'Pro': 399.0
}


export const addCampaign = async (req: Request, res: Response) => {
    
  const { videoLink, plan} = req.body;
  const sessionKey = req.get('SessionKey');

  console.log('Session key', sessionKey);

  let videoDetails;
  


  try {
    videoDetails = await youtubeService.validateVideoLink(videoLink);

  } catch(err) {
    
    return res.status(400).json( {error: "Invalid YouTube URL"});
  }

  if (!videoLink || !plan || !(plan in pricingTable) ) {
   
    return res.status(400).json({ error: "Missing required fields" });
  } else if(!sessionKey) {
    return res.status(400).json({error: 'Missing session key'});
  }

  const sessionExists = await sessionsModel.getSession(sessionKey as string, 'ADD_CAMPAIGN');

  if(!sessionExists.error && sessionExists.session) {
    return res.status(409).json({error: 'Duplicate request, start a new action to complete'});
  } else if(!sessionExists.session && sessionExists.error) {
    return res.status(500).json({error: 'Error looking up session'});
  }

  //Attempt to add session to record request 

  const addedSession = await sessionsModel.addSession(sessionKey, 'ADD_CAMPAIGN');
  
  
  if(!addedSession.created && addedSession.error === 'Duplicate') {
    return res.status(409).json({error: 'Duplicate request, start a new action to complete'})
  } else if(!addedSession.created) {
    return res.status(500).json({error: 'Error creating campaign, try again'})
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