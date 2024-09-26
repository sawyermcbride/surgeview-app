import React, {useState, useEffect} from "react";
import {Form, Input, Button, Typography, notification, Space, Select,
     Breadcrumb, RadioChangeEvent, Radio, Alert, Descriptions, Popconfirm, message, Modal} from "antd";

const {Text} = Typography;
interface CampaignsViewMobileProps {
     campaignsData: Array<object>,
     handleCampaignDetailsClick: (id: number) => void,
     handleCampaignClick: (id: number) => void,
}

const CampaignsViewMobile: React.FC<CampaignsViewMobileProps> = ({campaignsData, handleCampaignDetailsClick, handleCampaignClick}) => {
    const getStatusColor = (status: string) => {
      console.log(status);
        switch(status) {
            case 'active':
                return '#27ae60';
            case 'setup':
                return '#f39c12';
            case 'stopped':
                return '#e74c3c';
            default:
                return 'black';
        }
    }
     return (
          <div style={{ paddingTop: '16px', paddingBottom: '16px' }}> {/* Add padding around the content */}
          {campaignsData.map((campaign, index) => (
            <div key={index} style={{ marginBottom: '16px' }}> {/* Add spacing between Descriptions components */}
              <Descriptions
                column={1}
                bordered
                size="small"
                labelStyle={{
                    fontWeight: 'bold', 
                    width: '100px', // Adjust this value as needed
                    overflow: 'hidden', // Ensure text doesn't overflow
                    textOverflow: 'ellipsis' // Add ellipsis for overflow text
                 }}  // Make labels bold
                contentStyle={{ padding: '8px' }}  // Add padding around content
                style={{ borderCollapse: 'collapse' }} 
              >
                <Descriptions.Item label="Title">
                  <Text style={{fontWeight: 'bold'}}>{campaign.video_title}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Text style={{fontWeight: 'bold', color: getStatusColor(campaign.status)}}>
                    {(campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1))}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Price">
                  <Text>{campaign.plan_name} @ ${campaign.price} / Month</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Actions">
                    <Button onClick={() => handleCampaignDetailsClick(campaign.campaign_id)}style={{marginRight: "4px"}} type="primary">Details</Button>
                    <Button  onClick={() => handleCampaignClick(campaign.campaign_id)} type="default">Edit</Button>
                </Descriptions.Item>
              </Descriptions>
            </div>
          ))}
        </div>
     )
}


export default CampaignsViewMobile;