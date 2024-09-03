import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Progress,
  Card,
  Row,
  Col,
  Statistic,
  Spin,
  Flex,
  Alert
} from "antd";

import { HomeOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";
import StatCard from "../components/StatCard";
import MessageBox from "../components/MessageBox";
// const { Header, Content, Sider } = Layout;
// const { Title, Text } = Typography;

interface BaseStatisticsProps {
  campaignStatisics: any;
  loading: boolean;
}

const BaseStatistics = ({campaignStatistics, loading}) => {
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
          <div style={{display: "flex", flexWrap: "wrap", justifyContent:"center", alignItems: "flex-start", gap:"2px"}}>
          {(campaignStatistics && campaignStatistics.status.numberofSetup > 0) ? (
            <StatCard color="yellow" text="Campaign in Setup" icon="setting" suffix="In Setup" 
            data={campaignStatistics.status.numberofSetup}/>
          ): (null)}
          {(campaignStatistics && campaignStatistics.status.numberofActive > 0) ? (
              <StatCard color="green" text="Campaigns Active" icon="setting" suffix="Active"
                data={campaignStatistics.status.numberofActive}/>
          ): (null)}
            <StatCard color="blue" text="Last 24 Hours" icon="bar_chart" suffix="Views" data={campaignStatistics.statistics.views.lastDay}/>
            <StatCard color="blue" text="Last 24 Hours" icon="bar_chart" suffix="Subscribers" data={campaignStatistics.statistics.subscribers.lastDay}/>
            <StatCard color="blue" text="Last 24 Hours" icon="bar_chart" suffix="Views" data={campaignStatistics.statistics.views.lastWeek}/>
            <StatCard color="blue" text="Last 7 Days" icon="bar_chart" suffix="Subscribers" data={campaignStatistics.statistics.subscribers.lastWeek}/>
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
