export interface CampaignResponse {
  campaign_id: number;
  video_link: string;
  price: string; 
  plan_name: string;
  status: 'active' | 'setup' | 'stopped';
  video_title: string;
  channel_title: string;
  payment_status: 'not_attempted' | 'succeeded'; // Enum for known statuses
}

interface CampaignStatistics {
  campaign_id: number,
  views: number, 
  likes: number,
  comments: number,
  start_timestamp: string,
  subcribers: number,
  end_timestamp: string,
  time_period: string
}

export interface StatisticsResponse {
  status: {
    error: string;
    numberofActive: number;
    numberofSetup: number;
  };
  statistics: {
    error: string;
    views: {
      lastDay: number;
      lastWeek: number;
    };
    subscribers: {
      lastDay: number;
      lastWeek: number;
    };
    campaigns: {
      [campaignId: string]: CampaignStatistics[]; 
    };
  };
  errors: string[];
}
