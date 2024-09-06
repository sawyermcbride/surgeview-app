import React, {useState, useEffect, useContext} from 'react';
import { Table, Typography, Spin, Alert, Button, Breadcrumb, Tooltip, Tag } from 'antd';
import 'antd/dist/reset.css'; // Ensure Ant Design styles are imported
import { useAuth } from '../components/AuthContext';
import CampaignManage from './CampaignManage';
import CampaignDetails from './CampaignDetails';
import CampaignsViewMobile from './CampaignsViewMobile';
import { CampaignsContext } from '../contexts/CampaignsContext';

const { Title, Text } = Typography;


interface CampaignsViewProps {
    campaignData: any;
    campaignStatistics: any;
    loading: boolean;
    resetCampaignsView: boolean,
    isMobile: boolean,
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
  
  const statusOrder = {
    'active': 1,
    'setup': 2,
    'stopped': 3
  }


const CampaignsView: React.FC<CampaignsViewProps> = ({campaignData, loadCampaignData, campaignStatistics,
  resetCampaignsView, setResetCampaignsView, isMobile, loading}) => {
    
  const {login, token} = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  // const [campaignViewSetting, setCampaignViewSetting] = useState(0);
  // const [selectedVideoID, setSelectedVideoID] = useState(0);
  // const [breadcrumbLink, setBreadcrumbLink] = useState("");
  // const [loading, setLoading] = useState(false);
  // const [showBreadcrumb, setShowBreadcrumb] = useState(false);
  // const [breadcrumbSecondaryTitle, setBreadcrumbSecondaryTitle] = useState("");

  const {campaignsStateData, updateCampaignData} = useContext(CampaignsContext);

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
        render: (text: string) => {
          let toolTipMessage = "";
          let displayText = "";
          let color = "";

          switch(text.toLowerCase()) {
            case "active":
              toolTipMessage = "Your campaign is active. Click details to the right to view results, there may be a delay in these numbers.";
              displayText = text.charAt(0).toUpperCase() + text.slice(1);
              color = '#27ae60'; // Green
              break;
            case "setup":
              toolTipMessage = "Your campaign is waiting approval by YouTube. This usually takes a few hours.";
              displayText = "In-Setup";
              color = '#f39c12'; // Yellow
              break;
            case "stopped":
              toolTipMessage = "Your campaign is stopped. To restart it click edit and start.";
              displayText = "Stopped";
              color = "#e74c3c";
              break;
            default:
              toolTipMessage = "Unknown campaign status.";
              displayText = "Unknown";
              color = '#bdc3c7'; // Gray
              
              
          }
          return (
            <Tooltip title={toolTipMessage}>
              <Text
                style={{
                  color: color, 
                  fontWeight: 'bold', 
                  display: 'inline-block',
                  margin: 0,
                  cursor: "pointer"
                }}
              >
                {displayText}
              </Text> 
            </Tooltip>
          )
        }
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
      updateCampaignData({loading: true});

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
        const sortedCampaigns = displayCampaignData.sort( (a, b) => {
          return statusOrder[a.status] - statusOrder[b.status];
        })
        
        setCampaigns(sortedCampaigns);
        updateCampaignData({loading: false});
      }

      if(resetCampaignsView) {
        updateCampaignData({
          loading: true,
          campaignViewSetting: 0,
          showBreadcrumb: false
        })

        setTimeout( () => {
          updateCampaignData({loading: false});
        }, 1500);
        setResetCampaignsView(false);
      }

    }, [resetCampaignsView, campaignData]);

    const handleCampaignClick = (id: number) => {
      updateCampaignData({
        breadcrumbSecondaryTitle: "Edit",
        selectedVideoID: id,
        campaignViewSetting: 1,
        breadcrumbLink: campaigns.find( c => c.campaign_id === id).video_link,
        showBreadcrumb: true,
        loading: true
      })

      setTimeout( () => {
        updateCampaignData({
          loading: false
        })
      }, 1000)
    }

    const handleCampaignDetailsClick = (id: number) => {
      updateCampaignData({
        breadcrumbSecondaryTitle: "Details",
        selectedVideoId: id,
        campaignViewSetting: 2,
        breadcrumbLink: campaigns.find( c => c.campaign_id === id).video_link,
        loading: true,
        showBreadcrumb: true,
      })

      setTimeout( () => {
        updateCampaignData({
          loading: false
        })
      }, 1000)
    }

    const handleBreadcrumbClick = (page: string) => {
      setResetCampaignsView(true);
      // updateCampaignData({
      //   showbreadCrumb: false
      // })
    }

    const getVideoLink = () => {
      const dataResult = campaigns.find(c => c.campaign_id === campaignsStateData.selectedVideoId);
      return dataResult ? dataResult.video_title : '';
    }
    
    const handleRowClick = (record) => {
      handleCampaignDetailsClick(record.campaign_id);
    }

    const getView = () => {
      console.log(`New getView render campaignsStateData.campaignViewSetting = ${campaignsStateData.campaignViewSetting}`);
      if(campaignsStateData.campaignViewSetting === 0) {
        if(isMobile) {
          return (
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <CampaignsViewMobile campaignsData = {campaignData}
              handleCampaignClick={handleCampaignClick} handleCampaignDetailsClick={handleCampaignDetailsClick}/>
            </div>
          )
        } else {
          return (  
            <div style={{display: 'flex', justifyContent: 'center'}}>
  
              <Table
                dataSource={campaigns}
                columns={data_columns}
                pagination={false}
                onRow={(record) => {
                  return {
                    onClick: () => {
                      handleRowClick(record);
                    }
                  }
                }}
              />
            </div>
          )

        }
      } else if (campaignsStateData.campaignViewSetting === 1) {
        return (
          <div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <CampaignManage loadCampaignData = { loadCampaignData}
                data={campaigns.find(c => c.campaign_id === campaignsStateData.selectedVideoId)}
                />
            </div>
          </div>
        )
      } else if(campaignsStateData.campaignViewSetting === 2) {
        return (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <CampaignDetails campaignStatistics={campaignStatistics}/>
          </div>
        )
      }
    }

    /**
     * TODO: change breadcrumb to items 
     */
    return (
      <div>
        {campaignsStateData.showBreadcrumb ? (

          <Breadcrumb
            items={[
              {
                title: <span style={{cursor: 'pointer'}} onClick={() => handleBreadcrumbClick('Campaigns')}>Campaigns</span>
              },
              {
                title: campaignsStateData.breadcrumbSecondaryTitle   
              },
              {
                title: getVideoLink()
                // title: campaignsStateData.selectedVideoId
              } 
            ]}
          />
        ) : null}
        {(loading || campaignsStateData.loading) ? (
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
