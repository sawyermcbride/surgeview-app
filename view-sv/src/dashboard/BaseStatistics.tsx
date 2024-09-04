import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Row,
  Col,
} from "antd";

import { HomeOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";
import StatCard from "../components/StatCard";
import MessageBox from "../components/MessageBox";
// const { Header, Content, Sider } = Layout;
// const { Title, Text } = Typography;

interface BaseStatisticsProps {
  campaignStatisics: any;
  loading: boolean;
  isMobile: boolean;
}

const BaseStatistics: React.FC<BaseStatisticsProps> = ({campaignStatistics, loading, isMobile}) => {
  const [displayMessageBox, setDisplayMessageBox] = useState(false);

  useEffect( ()=> {
  },[campaignStatistics])

  const renderStatistics = () => {

    if(campaignStatistics) {
      return (
        <div>
          {(campaignStatistics && campaignStatistics.status.numberofSetup > 0) ? (
          <div style={{display: "flex", justifyContent: "center"}}>
            <MessageBox title="Notification" text="One of more of your campaigns is currently waiting to be approved by YouTube. 
            Please allow a few hours before it begins running"/>
          </div>
          ) : (null)}
          <Row gutter={[24, 24]}>
            <Col xxl={6} xl={8} lg={12} md={12} sm={12} xs={24}>
              {(campaignStatistics && campaignStatistics.status.numberofSetup > 0) ? (
                <StatCard isMobile={false} textColor="white" color="yellow" text="Campaign in Setup" icon="setting" suffix="In Setup" 
                data={campaignStatistics.status.numberofSetup}/>
              ): (null)}
            </Col>
            <Col xxl={6} xl={8} lg={12} md={12} sm={12} xs={24}>
              {(campaignStatistics && campaignStatistics.status.numberofActive > 0) ? (
                  <StatCard isMobile={false} textColor="white" color="green" text="Campaigns Active" icon="setting" suffix="Active"
                    data={campaignStatistics.status.numberofActive}/>
              ): (null)}
            </Col>
            <Col xxl={6} xl={8} lg={12} md={12} sm={12} xs={24}>
              <StatCard isMobile={false} textColor="blue" color="white" text="Last 24 Hours" icon="bar_chart" suffix="Views" data={campaignStatistics.statistics.views.lastDay}/>
            </Col>
            <Col xxl={6} xl={8} lg={12} md={12} sm={12} xs={24}>
              <StatCard isMobile={false} textColor="blue" color="white" text="Last 24 Hours" icon="bar_chart" suffix="Subscribers" data={campaignStatistics.statistics.subscribers.lastDay}/>
            </Col>
            <Col xxl={6} xl={8} lg={12} md={12} sm={12} xs={24}>
              <StatCard isMobile={false} textColor="blue" color="white" text="Last 7 Days" icon="bar_chart" suffix="Views" data={campaignStatistics.statistics.views.lastWeek}/>
            </Col>
            <Col xxl={6} xl={8} lg={12} md={12} sm={12} xs={24} >
              <StatCard isMobile={false} textColor="blue" color="white" text="Last 7 Days" icon="bar_chart" suffix="Subscribers" data={campaignStatistics.statistics.subscribers.lastWeek}/>
            </Col>
          </Row>

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
