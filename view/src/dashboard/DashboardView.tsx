import React, { useState } from "react";
import BaseStatistics from "./BaseStatistics";
import CampaignForm from "./CampaignForm";
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

const DashboardView = () => {
  const [dashboardView, setDashboardView] = useState(0);

  const renderView = () => {
    switch (dashboardView) {
      case 0:
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
          </div>
        );
      case 1:
        return <CampaignForm setDashboardView={setDashboardView} />;

      case 2:
        return <BaseStatistics />;
    }
  };

  return <div>{renderView()}</div>;
};

export default DashboardView;
