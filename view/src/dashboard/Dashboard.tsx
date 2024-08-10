// src/components/Dashboard/Dashboard.tsx
import React, { useState } from "react";
import DashboardView from "./DashboardView";

import { Layout, Menu, Button, Typography } from "antd";
import { HomeOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;
const { Header, Sider, Content } = Layout;

const Dashboard: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div
          className="logo"
          style={{ padding: "16px", textAlign: "center", color: "#fff" }}
        >
          SurgeView
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            Profile
          </Menu.Item>
          <Menu.Item key="3" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }}>
          <Title level={2} style={{ margin: "16px" }}>
            Dashboard
          </Title>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flext-start",
            paddingTop: "50px",
          }}
        >
          <DashboardView />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
