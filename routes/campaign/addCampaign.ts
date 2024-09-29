import express, {Request, Response} from "express";
import YouTubeService from "../../services/YouTubeService";
import AdsService from "../../services/AdsService";
import Campaigns from "../../models/Campaigns";
import SessionsModel from "../../models/SessionsModel";
import logger from "../../utils/logger";
import { AddCampaignObject } from "../../types/ModelTypes";

const youtubeService = new YouTubeService();
const campaigns = new Campaigns();
const sessionsModel = new SessionsModel();
const adsService = new AdsService();

const pricingTable: {[key: string]: number} = {
  'Standard': 99.0,
  'Premium': 199.0,
  'Pro': 399.0
}


export const addCampaign = async (req: Request, res: Response) => {
    
  const { videoLink, plan} = req.body;
  const sessionKey = req.get('SessionKey');

  logger.info('Adding campaign ', {videoLink, plan, sessionKey});

  console.log('Session key', sessionKey);

  let videoDetails;
  
  if(!req.user) {
    return res.status(401);
  }

  try {
    videoDetails = await youtubeService.validateVideoLink(videoLink);

  } catch(err) {
    
    return res.status(400).json( {error: "Invalid YouTube URL"});
  }

  if (!videoLink || !plan || !(plan in pricingTable) ) {
    logger.error('Missing required fields');
    return res.status(400).json({ error: "Missing required fields" });
  } else if(!sessionKey) {
    logger.error('Missing session key');
    return res.status(400).json({error: 'Missing session key'});
  }

  const sessionExists = await sessionsModel.getSession(sessionKey as string, 'ADD_CAMPAIGN');

  if(!sessionExists.error && sessionExists.session && sessionExists.session.status !== 'FAILED') {
    
    logger.info('Duplicate request, not adding campaign');
    return res.status(200).json({message: 'Duplicate request, not adding campaign'});
  } else if(!sessionExists.session && sessionExists.error) {
    logger.error('Error looking up session');
    return res.status(500).json({error: 'Error looking up session'});
  }

  //Attempt to add session to record request 

  const addedSession = await sessionsModel.addSession(sessionKey, 'ADD_CAMPAIGN');
  
  
  if(!addedSession.created && addedSession.error === 'Duplicate') {
    logger.info('Duplicate request, start a new action to complete');

    return res.status(200).json({error: 'Duplicate request, start a new action to complete'})
  } else if(!addedSession.created) {

    logger.error('Error creating campaign, try again, session not created, returning 500');
    logger.error(addedSession.error);
    return res.status(500).json({error: 'Error creating campaign, try again'})
  }

  
  
  try {
    const userEmail = req.user?.email;

    const addCampaign: AddCampaignObject = {
      video_link: videoLink, 
      price: pricingTable[plan],
      plan_name: plan,
      channel_title: videoDetails.channelTitle,
      video_title: videoDetails.title
    }
    
    const result = await campaigns.addCampaign(addCampaign,userEmail);

    /**
     * Call external service to create the ad in Google Ads (as of now the external service will only populate
     * the google_ads related fields in the database with numbers but not take any action with the google ads api)
     * 
     */

    const adsServiceResult = await adsService.createAd(addCampaign, result.campaign_id);

    if(!adsServiceResult.complete) {
      logger.error('Error contacting ads service');
    } else {
      logger.info('Successfuly called ads service');
    }
    
    if(result.campaign_id > -1 && !result.error) {
      logger.info('Campaign added', {campaignId: result.campaign_id});
      
      
      sessionsModel.updateSession(sessionKey, 'COMPLETE', 'ADD_CAMPAIGN');

      return res.status(201).json({campaignId: result.campaign_id, message: "Campaign added" });
    } else {

      logger.error('Error adding campaign', {error: result.error});
      throw new Error(result.error);
    }


  
  } catch (err) {
    logger.info('Error adding campaign, returning 500 code', {error: err});
    return res.status(500).json({ message: "Error adding campaign", err });
  }
}