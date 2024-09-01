//YouTube router

import { Router, Request, Response } from "express";
import YouTubeService from "../services/YouTubeService";

const router = Router();
// if(!process.env.JWT_SECRET) {
//     throw new Error("Missing YouTube API key");
// }
const youtubeService = new YouTubeService();

router.post("/validate/", async (req: Request, res: Response) => {
    const url = req.body.url;
    try {
        const videoDetails = await youtubeService.validateVideoLink(url);
        return res.status(200).json(videoDetails);
    } catch(err) {
        return res.status(400).json({error: err});
    }
});

export default router;