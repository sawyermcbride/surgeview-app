import express, {Request, Response} from "express";
import YouTubeService from "../../services/YouTubeService";
import {query} from '../../db';

const youtubeService = new YouTubeService();

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
    const userEmail = req.user.email;
    const customerID = await query(
      "SELECT ID FROM customers WHERE email = $1",
      [userEmail],
    );
    
    console.log(videoDetails);
    await query("BEGIN");
    const result = await query(
      `INSERT INTO campaigns (customer_id, video_link, price, plan_name,
       video_title, channel_title, status, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING campaign_id`,
      [customerID.rows[0].id, videoLink, pricingTable[plan], plan, videoDetails.title,
       videoDetails.channelTitle, 'setup', 'not_attempted'],
    );

    await query("COMMIT");

    return res.status(201).json({campaignId: result.rows[0].campaign_id, message: "Campaign added" });
  
  } catch (err) {
    await query("ROLLBACK");
  
    return res.status(500).json({ message: "Error adding campaign", err });
  }
}