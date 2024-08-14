import React, { useState } from "react";
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
  Alert,
} from "antd";

import { HomeOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";
import StatCard from "../components/StatCard";
import MessageBox from "../components/MessageBox";
// const { Header, Content, Sider } = Layout;
// const { Title, Text } = Typography;

const BaseStatistics = () => {
  const [loading, setLoading] = useState<boolean>(true);
  

  return (
    <div>
      <div style={{display: "flex", justifyContent: "center"}}>
        <MessageBox title="Notification" text="Your campaign is currently waiting to be approved by YouTube. Please allow a few hours before it begins running"/>
      </div>
      <div style={{display: "flex", justifyContent: "center"}}>
        <StatCard color="yellow" text="Campaign in Setup" icon="setting" suffix="In Setup" data={1}/>
        <StatCard color="green" text="Campaigns Active" icon="setting" suffix="Active" data={1}/>
        <StatCard color="blue" text="Last 7 Days" icon="bar_chart" suffix="Views" data={953}/>
        <StatCard color="blue" text="Last 24 Hours" icon="bar_chart" suffix="Views" data={148}/>
      </div>
    </div>
    
  );
};
export default BaseStatistics;
