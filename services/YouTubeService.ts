import axios from "axios";

interface VideoDetails {
    valid: boolean, 
    title: string, 
    channelTitle: string
}

class YouTubeService {
    // YOUTUBE_API_KEY = 'AIzaSyCu8EM2Bo6REdjvZ81NZ-S5K7vf6FWr7Bw';
    private apiKey: string;

    constructor() {
        this.apiKey = process.env.YOUTUBE_API_KEY || "AIzaSyCu8EM2Bo6REdjvZ81NZ-S5K7vf6FWr7Bw";
    }
    /**
     * Gets video details and valdiates video link
     * @param videoId extracted from extractVideoId private function
     * @returns VideoDetails object with valid, title, channelTitle
     */
    private async getVideoDetails(videoId: string): Promise<VideoDetails> {
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${this.apiKey}&part=snippet`;
        
        try {
            const response = await axios.get(url);
            const items = response.data.items;
            if(items && items.length > 0) {
                console.log(`YouTube API response data = ${items[0].snippet}`);
                const valid = true;
                const {title, channelTitle} = items[0].snippet

                return {valid, title, channelTitle };
            } else {
                throw new Error("Video not found");
            }

        } catch(err) {
            throw new Error("Invalid YouTube video URL");
        }
    }
    private extractVideoId(videoLink: string): string | null {
        const match = videoLink.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : null;
    }
    /**
     * 
     * @param videoLink link to get title and channel of, if invalid the return property in the object (valid) will be false
     * @returns object with {valid, videoTitle, channelTitle}
     */

    public async validateVideoLink(videoLink: string): Promise<VideoDetails> {
        console.log("validateVideoLink called with:", videoLink); 
        const videoId = this.extractVideoId(videoLink);

        console.log(`VideoID = ${videoId}`);

        if(!videoId) {
            throw new Error("Invalid YouTube URL format");
        }

        return await this.getVideoDetails(videoId);

    }
}

export default YouTubeService; 