import React, {useState, useEffect} from 'react';
import { Table, Typography, Spin, Alert } from 'antd';
import 'antd/dist/reset.css'; // Ensure Ant Design styles are imported
import axios from "axios";
import { useAuth } from '../components/AuthContext';
import LoginForm from '../components/LoginForm';
const { Title } = Typography;

// Sample data for the table

const data_columns = [
    {
      title: 'Campaign ID',
      dataIndex: 'campaign_id',
      key: 'campaign_id',
    },
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
    }
  ];
  

const CampaignsView: React.FC = () => {
    const {login, token} = useAuth();
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const loadCampaigns = async () => {
            try {
                await login();
                console.log("campaigns view");
                console.log(token);
                const result = await axios.get("http://10.0.0.47:3001/campaign/request", {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                } );

                setCampaigns(result.data);
                console.log(data);
            } catch(err) {
                console.log(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        loadCampaigns();
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
        dataSource={campaigns}
        columns={data_columns}
        pagination={false}
      />
    </div>
  );
};

export default CampaignsView;
