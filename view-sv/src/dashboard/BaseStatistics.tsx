import React, { useEffect, useState } from "react";
import { Typography, Row, Col, Divider, Space} from "antd";

import StatisticsGraphsView from "../components/dashboard/StatisticsGraphsView";
import { Line } from 'react-chartjs-2';

import StatCard from "../components/StatCard";
import MessageBox from "../components/MessageBox";


const {Title} = Typography;
interface BaseStatisticsProps {
  campaignStatisics: any;
  loading: boolean;
  isMobile: boolean | undefined;
}

const BaseStatistics: React.FC<BaseStatisticsProps> = ({campaignStatistics, loading, isMobile}) => {


  useEffect( ()=> {
  },[campaignStatistics])

  const renderStatistics = () => {

    if(campaignStatistics) {
      return (
        <div>
          <div style={{textAlign: 'center', marginBottom: '25px'}}>
            <Title level={3} style={{fontWeight: 'bold'}} underline={false}>Stats Across Your Campaigns</Title>
            <Divider/>
          </div>
          {(campaignStatistics && campaignStatistics.status.numberofSetup > 0) ? (
            <div style={{display: "flex", justifyContent: "center"}}>
            <MessageBox title="Notification" text="One of more of your campaigns is currently waiting to be approved by YouTube. 
            Please allow a few hours before it begins running"/>
          </div>
          ) : (null)}
          <Row gutter={[24, 24]}>
              {(campaignStatistics && campaignStatistics.status.numberofSetup > 0) ? (
                <Col xxl={6} xl={8} lg={12} md={12} sm={12} xs={24}>
                    <StatCard isMobile={false} textColor="white" color="yellow" text="Campaign in Setup" icon="setting" suffix="In Setup" 
                    data={campaignStatistics.status.numberofSetup}/>
                </Col>
              ): (null)}
              {(campaignStatistics && campaignStatistics.status.numberofActive > 0) ? (
                <Col xxl={6} xl={8} lg={12} md={12} sm={12} xs={24}>
                      <StatCard isMobile={false} textColor="white" color="green" text="Campaigns Active" icon="setting" suffix="Active"
                        data={campaignStatistics.status.numberofActive}/>
                </Col>
              ): (null)}
            <Col xxl={6} xl={8} lg={12} md={12} sm={12} xs={24}>
              <StatCard isMobile={false} textColor="white" color="blue" text="Last 24 Hours" icon="bar_chart" suffix="Views" data={campaignStatistics.statistics.views.lastDay}/>
            </Col>
            <Col xxl={6} xl={8} lg={12} md={12} sm={12} xs={24}>
              <StatCard isMobile={false} textColor="white" color="blue" text="Last 24 Hours" icon="bar_chart" suffix="Subscribers" data={campaignStatistics.statistics.subscribers.lastDay}/>
            </Col>
            <Col xxl={6} xl={8} lg={12} md={12} sm={12} xs={24}>
              <StatCard isMobile={false} textColor="white" color="blue" text="Last 7 Days" icon="bar_chart" suffix="Views" data={campaignStatistics.statistics.views.lastWeek}/>
            </Col>
            <Col xxl={6} xl={8} lg={12} md={12} sm={12} xs={24} >
              <StatCard isMobile={false} textColor="white" color="blue" text="Last 7 Days" icon="bar_chart" suffix="Subscribers" data={campaignStatistics.statistics.subscribers.lastWeek}/>
            </Col>
          </Row>
          <div style={{width: '100%'}}>
              <StatisticsGraphsView/>
          </div>
        </div>
      )
    }
}

  return (
    <div>
      {renderStatistics()}
    </div>
    
  );
};
export default BaseStatistics;
