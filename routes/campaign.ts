import express, { Request, Response, NextFunction } from "express";
import { expressjwt as jwt } from "express-jwt";
import { query } from "../db";
import { emit } from "process";
import YouTubeService from "../services/YouTubeService";
import StatisticsService from "../services/StatisticsService";

const router = express.Router();
const youtubeService = new YouTubeService();
const statisticsService = new StatisticsService();

const pricingTable = {
  'Standard': 99.0,
  'Premium': 199.0,
  'Pro': 399.0
}


router.use( (req: Request, res: Response, next: NextFunction) => {
  // console.log(`${req.method} ${req.originalUrl}`);
  next();
});

router.post("/add", async (req: Request, res: Response) => {

  const { videoLink, plan } = req.body;
  let videoDetails;

  try {
    videoDetails = await youtubeService.validateVideoLink(videoLink);

  } catch(err) {
    
    return res.status(400).json( {error: "Invalid YouTube URL"});
  }

  if (!videoLink || !plan || !(plan in pricingTable) ) {
    return res.status(400).json({ error: "Missing required fields" });
  }


  try {
    const userEmail = req.user.email;
    const startDate = new Date();
    const endDate = new Date(startDate);

    endDate.setDate(startDate.getDate() + 30);

    const customerID = await query(
      "SELECT ID FROM customers WHERE email = $1",
      [userEmail],
    );
  
    console.log(videoDetails);
    await query("BEGIN");
    const result = await query(
      `INSERT INTO campaigns (customer_id, video_link, start_date, end_date, price, plan_name, video_title, channel_title, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING campaign_id`,
      [customerID.rows[0].id, videoLink, startDate, endDate, pricingTable[plan], plan, videoDetails.title, videoDetails.channelTitle, 'setup'],
    );

    await query("COMMIT");

    return res.status(201).json({campaignId: result.rows[0].campaign_id, message: "Campaign added" });
  
  } catch (err) {
    await query("ROLLBACK");
  
    return res.status(500).json({ message: "Error adding campaign", err });
  }
});

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

router.put("/update/:id", async (req: Request, res: Response) => {
  const updateFields = ['video_link', 'plan_name', 'status'];

  let videoId = req.params.id; 
  let updateData = req.body;
  let videoDetails;
  console.log(`video_link in request = ${updateData.video_link}`);
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

});


router.get("/statistics", async(req: Request, res: Response) => {
  const statisticsJson = await statisticsService.getBaseStatisics(req.user.email);

  return res.status(200).json(statisticsJson );
});


export default router;
