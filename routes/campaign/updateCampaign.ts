//updateCampaign controller

import express, {Request, Response} from "express";
import YouTubeService from "../../services/YouTubeService";
import {query} from '../../db';

const youtubeService = new YouTubeService();

const pricingTable = {
    'Standard': 99.0,
    'Premium': 199.0,
    'Pro': 399.0
}
  

export const updateCampaign = async (req: Request, res: Response) => {
    const updateFields = ['video_link', 'plan_name', 'status'];
  
    let videoId = req.params.id; 
    let updateData = req.body;
    let videoDetails;
    console.log(`video_link in request = ${updateData.video_link}`);
    if(!updateData[updateFields[0]] && !updateData[updateFields[1]] &&
        !updateData[updateFields[2]]) {
          return res.status(400).json({error: "No fields to update"});
    }
    if(updateData.video_link)  {
      try {
        videoDetails = await youtubeService.validateVideoLink(updateData.video_link);
  
      } catch(err) {
        return res.status(400).json({error: err});
      }
  
    }
  
    if(updateData.plan_name && !(updateData.plan_name in pricingTable)) {
      return res.status(400).json({error: "Missing required fields"});
    }
    
    try {
      if(!req.user.email) {
        return res.status(401).json({message: "User not authorized"});
      } else {
        console.log("Making query");
        let result = await query(`SELECT customers.email, campaigns.campaign_id, campaigns.video_link, campaigns.plan_name,
          campaigns.video_title, campaigns.channel_title
          FROM customers JOIN campaigns ON customers.id = campaigns.customer_id
          WHERE email = $1 AND campaigns.campaign_id = $2`, [req.user.email, videoId]);
          
          for (const elem of updateFields) {
          // console.log(`Updating ${elem} field where updateData[elem] = ${updateData[elem]} and database has value ${result.rows[0][elem]}`);
            // console.log(`result.rows[0][elem] = ${result.rows[0][elem]} and updateData[elem] = ${updateData[elem]} and elem = ${elem}`);
          if(updateData[elem] && updateData[elem] !== result.rows[0][elem]) {
            const queryText = `UPDATE campaigns SET ${elem} = $1 WHERE campaign_id = $2`;
            if(elem === 'plan_name') {
              // console.log(`updating price, current price = ${pricingTable[result.rows[0]['plan_name']]} and new price = ${pricingTable[updateData.plan_name]} `);
              await query('UPDATE campaigns SET price = $1 WHERE campaign_id = $2', [pricingTable[updateData.plan_name], videoId]);
            } else if(elem === 'video_link') {
              console.log(`Updating video link with title = ${videoDetails.title} and channel = ${videoDetails.channelTitle}`);
              await query('UPDATE campaigns SET video_title = $1, channel_title = $2 WHERE campaign_id = $3',
                 [videoDetails.title, videoDetails.channelTitle, result.rows[0].campaign_id]);
            }
            await query(queryText, [updateData[elem], videoId]);  
          }
        }
        return res.status(200).json({complete: true, message: "Campaign updated"});
      };
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: err});
    }
}