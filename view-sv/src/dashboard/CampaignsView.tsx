import React, {useState, useEffect} from 'react';
import { Table, Typography, Spin, Alert, Button, Breadcrumb, Tooltip, Tag } from 'antd';
import 'antd/dist/reset.css'; // Ensure Ant Design styles are imported
import { useAuth } from '../components/AuthContext';
import CampaignManage from './CampaignManage';
import CampaignDetails from './CampaignDetails';

import { StripePaymentMethodMessagingElement } from '@stripe/stripe-js';
const { Title, Text } = Typography;

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



const CampaignsView: React.FC<CampaignsViewProps> = ({campaignData, loadCampaignData, campaignStatistics,
   resetCampaignsView, setResetCampaignsView}) => {
  
  const {login, token} = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [campaignViewSetting, setCampaignViewSetting] = useState(0);
  const [selectedVideoID, setSelectedVideoID] = useState(0);
  const [breadcrumbLink, setBreadcrumbLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBreadcrumb, setShowBreadcrumb] = useState(false);
  const [breadcrumbSecondaryTitle, setBreadcrumbSecondaryTitle] = useState("");

  // const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  

  const data_columns = [
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        align: 'center',
        onCell: () => {
          return { style: { textAlign: "center" } }; // Flexbox style to allow column to shrink or expand
        },
        render: (text: string) => (
          text === 'active' ? (
            <Tooltip title={"Your campaign is active. Click details to the right to view results, their may be a delay in these numbers."}>
              <Text
                style={{
                  color: '#27ae60', 
                  fontWeight: 'bold', 
                  display: 'inline-block',
                  margin: 0,
                  cursor: "pointer"
                }}
              >
                {text && text.charAt(0).toUpperCase() + text.slice(1)}
              </Text> 
            </Tooltip>
          ) : (
            <Tooltip title={"Your campaign is waiting approval by YouTube. This usually takes a few hours"}>
              <Text
                style={{
                  color:'#e67e22', 
                  fontWeight: 'bold', 
                  display: 'inline-block',
                  margin: 0,
                  cursor: "pointer"
                }}
              >
                {text && "In-" + text.charAt(0).toUpperCase() + text.slice(1)}
              </Text>
          </Tooltip>
          )
        ), 
      },
      {
        title: 'Plan Name',
        dataIndex: 'plan_name',
        key: 'plan_name',
        width: 120,
        render: (text: string) => (
          <Text>
            {text}
          </Text>
        ), 
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        width: 120,
        render: (text: string) => `$${text}`, // Format as currency
      },
      {
          title: 'Video Title',
          dataIndex: 'video_title',
          key: 'video_title',
          responsive:["sm"],
          ellipsis: true,
          onCell: () => {
            return { style: { minWidth: '150px', flex: 1 } }; // Flexbox style to allow column to shrink or expand
          },
          render: (text:string) => (
            // text
            <Tooltip title={text}>
                <Text style={{
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}>
                    {text}
                </Text>
            </Tooltip>
          ),
      },
      {
          title: 'Actions',
          key: 'actions',
          width: 200,
          onCell: () => {
            return { style: { textAlign: "center" } }; // Flexbox style to allow column to shrink or expand
          },
          render: (_: any, record: CampaignDisplayObj) => (
            <span>
              <Button onClick={() => handleCampaignDetailsClick(record.campaign_id)}style={{marginRight: "4px"}} type="primary">Details</Button>
              <Button  onClick={() => handleCampaignClick(record.campaign_id)} type="default">Edit</Button>
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
            status: element.status,
            end_date: element.end_date,
            video_link: element.video_link,
            price: element.price,
            video_title: element.video_title, 
            channel_title: element.channel_title,
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
      setBreadcrumbSecondaryTitle("Edit");
      setSelectedVideoID(id);
      setCampaignViewSetting(1);
      setBreadcrumbLink(campaigns.find( c => c.campaign_id === id).video_link);
      setLoading(true);
      setShowBreadcrumb(true);
      setTimeout( () => {
        setLoading(false);
      }, 1000)
    }

    const handleCampaignDetailsClick = (id: number) => {
      setBreadcrumbSecondaryTitle("Details");
      setSelectedVideoID(id);
      setCampaignViewSetting(2);
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
      return dataResult ? dataResult.video_title : '';
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
      } else if(campaignViewSetting === 2) {
        return (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <CampaignDetails campaignStatistics={campaignStatistics} setLoading={setLoading}/>
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

          <Breadcrumb
            items={[
              {
                title: <span style={{cursor: 'pointer'}} onClick={() => handleBreadcrumbClick('Campaigns')}>Campaigns</span>
              },
              {
                title: breadcrumbSecondaryTitle   
              },
              {
                title: getVideoLink()
              } 
            ]}
          />
        ) : null}
        {loading ? (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Spin size="large" style={{marginTop: "25px"}}/>
          </div>
        ): (
          <div style={{width: '100%'}}>
              <div style={{ padding: '24px', width: '100%'}}>
                {getView()}
              </div>
          </div>
        )}
      </div>
  );
};

export default CampaignsView;
