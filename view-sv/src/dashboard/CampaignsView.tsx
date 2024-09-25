import React, {useState, useEffect, useContext} from 'react';
import { Table, Typography, Spin, Alert, Button, Breadcrumb, Tooltip, Tag } from 'antd';
import {PlusOutlined} from "@ant-design/icons"

import CampaignManage from './CampaignManage';
import CampaignDetails from './CampaignDetails';
import CampaignsViewMobile from './CampaignsViewMobile';
import { CampaignsContext } from '../contexts/CampaignsContext';
import { getCampaignsColumns } from '../config/CampaignsColumns';


interface CampaignsViewProps {
    campaignData: any;
    campaignStatistics: any;
    loading: boolean;
    resetCampaignsView: boolean,
    isMobile: boolean,
    setResetCampaignsView: (arg: boolean) => void,
    loadCampaignData: () => Promise<void>,
}
  const statusOrder = {
    'active': 1,
    'setup': 2,
    'stopped': 3
  }


const CampaignsView: React.FC<CampaignsViewProps> = ({campaignData, loadCampaignData, campaignStatistics,
  resetCampaignsView, setResetCampaignsView, isMobile, loading}) => {
  const [campaigns, setCampaigns] = useState();
  const {campaignsStateData, updateCampaignData} = useContext(CampaignsContext);

  
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
      

    }, [resetCampaignsView, campaignData, campaignsStateData.campaignViewSetting]);

    const handleCampaignClick = (id: number) => {
      
      
      updateCampaignData({
        breadcrumbSecondaryTitle: "Edit",
        selectedVideoId: id,
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

    const handleAddCampaign = function() {

    }

    const handleCampaignDetailsClick = async (id: number) => {
      await loadCampaignData();
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

    const handleBreadcrumbClick = () => {
      setResetCampaignsView(true);
      // updateCampaignData({
      //   showbreadCrumb: false
      // })
    }

    const getVideoLink = () => {
      const dataResult = campaigns.find(c => c.campaign_id === campaignsStateData.selectedVideoId);
      return dataResult ? dataResult.video_title : '';
    }
    
    const getView = () => {


      if(campaignsStateData.campaignViewSetting === 0) {
        if(isMobile) {
          return (
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <CampaignsViewMobile campaignsData = {campaignData}
              handleCampaignClick={handleCampaignClick} handleCampaignDetailsClick={handleCampaignDetailsClick}/>
              <div style={{textAlign: "center"}}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCampaign}>
                  Add New Campaign
                </Button>
              </div>
            </div>
          )
        } else {
          return (  
            <div>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <Table
                  dataSource={campaigns}
                  columns={
                    getCampaignsColumns(handleCampaignDetailsClick, handleCampaignClick)
                  }
                  pagination={false}
                />
              </div>
              <div style={{marginTop: '25px', textAlign: "center"}}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCampaign}>
                  Add New Campaign
                </Button>
              </div>
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
            <CampaignDetails campaignStatistics={campaignStatistics &&
              campaignStatistics.statistics.campaigns[campaignsStateData.selectedVideoId]}/>
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
