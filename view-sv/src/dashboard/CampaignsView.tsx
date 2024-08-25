import React, {useState, useEffect} from 'react';
import { Table, Typography, Spin, Alert, Button } from 'antd';
import 'antd/dist/reset.css'; // Ensure Ant Design styles are imported
import axios from "axios";
import { useAuth } from '../components/AuthContext';
import LoginForm from '../components/LoginForm';
import { StripePaymentMethodMessagingElement } from '@stripe/stripe-js';
const { Title } = Typography;

// Sample data for the table

interface CampaignsViewProps {
    campaignData: any;
    campaignStatistics: any;
    loading: boolean;
}
interface CampaignDisplayObj {
    start_date: string,
    end_date: string,
    video_link: string,
    price: number,
    plan_name: string
}


const data_columns = [
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (text: string) => new Date(text).toLocaleDateString(), // Format date
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (text: string) => new Date(text).toLocaleDateString(), // Format date
    },
    {
      title: 'Plan Name',
      dataIndex: 'plan_name',
      key: 'plan_name',
      render: (text: string) => JSON.parse(text).pricing, // Parse JSON and display 'pricing'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text: string) => `$${text}`, // Format as currency
    },
    {
        title: 'Video Link',
        dataIndex: 'video_link',
        key: 'video_link',
        render: (text:string) => JSON.parse(text).youtube_url
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: CampaignDisplayObj) => (
          <span>
            <Button type="default">Edit</Button>
            <Button type="default" danger>Delete</Button>
          </span>
        ),
      }
  ];
  

const CampaignsView: React.FC<CampaignsViewProps> = ({campaignData, campaignStatistics, loading}) => {

    const {login, token} = useAuth();
    const [campaigns, setCampaigns] = useState<any[]>([]);
    // const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
      console.log(campaignData);

      if(campaignData) {
        const displayCampaignData = campaignData.map( (element) => {
            return {
              start_date: element.start_date,
              end_date: element.end_date,
              video_link: element.video_link,
              price: element.price,
              plan_name: element.plan_name
            }
          } );
        setCampaigns(displayCampaignData);
      }

    }, []);

    if (loading) return( 
        <div style={{display: "flex", justifyContent: "center"}}>
            <Spin size="large" tip="Loading campaigns..." />;
        </div>
    )
    // if (error) return <Alert message={error} type="error" />;

    return (
    <div style={{ padding: '24px' }}>
        <Table
        dataSource={campaignData}
        columns={data_columns}
        pagination={false}
      />
    </div>
  );
};

export default CampaignsView;
