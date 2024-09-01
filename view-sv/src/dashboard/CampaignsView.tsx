import React, {useState, useEffect} from 'react';
import { Table, Typography, Spin, Alert, Button, Breadcrumb } from 'antd';
import 'antd/dist/reset.css'; // Ensure Ant Design styles are imported
import { useAuth } from '../components/AuthContext';
import CampaignManage from './CampaignManage';

import { StripePaymentMethodMessagingElement } from '@stripe/stripe-js';
const { Title } = Typography;

// Sample data for the table

interface CampaignsViewProps {
    campaignData: any;
    campaignStatistics: any;
    loading: boolean;
    resetCampaignsView: boolean,
    setResetCampaignsView: (arg: boolean) => void,
    loadCampaignData: () => Promise<void>,
}
interface CampaignDisplayObj {
    campaign_id: number,
    start_date: string,
    end_date: string,
    video_link: string,
    price: number,
    plan_name: string
}



const CampaignsView: React.FC<CampaignsViewProps> = ({campaignData, loadCampaignData, resetCampaignsView, setResetCampaignsView}) => {
  
  const {login, token} = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [campaignViewSetting, setCampaignViewSetting] = useState(0);
  const [selectedVideoID, setSelectedVideoID] = useState(0);
  const [breadcrumbLink, setBreadcrumbLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBreadcrumb, setShowBreadcrumb] = useState(false);

  // const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
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
        render: (text: string) => text, // Parse JSON and display 'pricing'
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
          render: (text:string) => text,
      },
      {
          title: 'Actions',
          key: 'actions',
          render: (_: any, record: CampaignDisplayObj) => (
            <span>
              <Button style={{marginRight: "4px"}} onClick={() => handleCampaignClick(record.campaign_id)} type="default">Edit</Button>
              <Button type="default" danger>Delete</Button>
            </span>
          ),
        }
    ];
    

    useEffect(() => {
      if(campaignData) {
        const displayCampaignData = campaignData.map( (element) => {
            return {
              campaign_id: element.campaign_id,
              start_date: element.start_date,
              end_date: element.end_date,
              video_link: element.video_link,
              price: element.price,
              plan_name: element.plan_name
            }
          } );
        setCampaigns(displayCampaignData);
      }

      if(resetCampaignsView) {

        setLoading(true);
        setCampaignViewSetting(0);
        setShowBreadcrumb(false);
        setTimeout( () => {
          setLoading(false);
        }, 1500);
        setResetCampaignsView(false);
      }

    }, [resetCampaignsView, campaignData]);

    const handleCampaignClick = (id: number) => {

      setSelectedVideoID(id);
      setCampaignViewSetting(1);
      setBreadcrumbLink(campaigns.find( c => c.campaign_id === id).video_link);
      setLoading(true);
      setShowBreadcrumb(true);
      setTimeout( () => {
        setLoading(false);
      }, 1000)
    }

    const handleBreadcrumbClick = (page: string) => {
      setResetCampaignsView(true);
      
    }

    const getVideoLink = () => {
      const dataResult = campaigns.find(c => c.campaign_id === selectedVideoID);
      return dataResult ? dataResult.video_link : '';
    }

    const getView = () => {
      if(campaignViewSetting === 0) {
        return (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Table
              dataSource={campaignData}
              columns={data_columns}
              pagination={false}
            />
          </div>
        )
      } else if (campaignViewSetting === 1) {
        return (
          <div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <CampaignManage loadCampaignData = { loadCampaignData} setLoading={setLoading} 
                data={campaigns.find(c => c.campaign_id === selectedVideoID)}
              />
            </div>
          </div>
        )
      }
    }

    /**
     * TODO: change breadcrumb to items 
     */
    return (
      <div>
        {showBreadcrumb ? (
          <Breadcrumb>
            <Breadcrumb.Item onClick={() => handleBreadcrumbClick('Campaigns')}>
              Campaigns
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {getVideoLink()}
            </Breadcrumb.Item>
          </Breadcrumb>
        ) : null}
        {loading ? (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Spin size="large" style={{marginTop: "25px"}}/>
          </div>
        ): (
          <div>
              <div style={{ padding: '24px', width: '100%'}}>
                {getView()}
              </div>
          </div>
        )}
      </div>
  );
};

export default CampaignsView;
