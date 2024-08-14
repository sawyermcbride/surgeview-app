import React, { useState, useEffect } from "react";
import BaseStatistics from "./BaseStatistics";
import CampaignsView from "./CampaignsView";

import {
  Layout,
  Menu,
  Button,
  Typography,
  Progress,
  Card,
  Row,
  Col,
} from "antd";
import { HomeOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

interface DashboardViewProps {
  selectedMenu: string
}

const DashboardView: React.FC<DashboardViewProps> = (props) => {

  const viewComponent = {

  }
  const renderView = () => {
    switch (props.selectedMenu) {
      case "1":
        return (
          <BaseStatistics />
        );
      case "2":
        return(
          <CampaignsView/>
        )

      case "3":
        return (
          <div>
            
          </div>
        )
        
    }
  };

  return <div style={{width: "90%"}} >{
      renderView()
    }</div>;
};

export default DashboardView;
