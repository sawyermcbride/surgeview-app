export interface CampaignType {
  campaign_id: number;
  video_link: string;
  price: string; 
  plan_name: string;
  status: 'active' | 'setup' | 'stopped';
  video_title: string;
  channel_title: string;
  payment_status: 'not_attempted' | 'succeeded'; // Enum for known statuses
}

