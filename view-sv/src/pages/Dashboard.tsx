// src/components/Dashboard/Dashboard.tsx
import React, { useContext, useEffect, useState } from "react";
import DashboardView from "../dashboard/DashboardView";

import { Layout, Menu, Button, Typography, Dropdown } from "antd";
import { HomeOutlined, BarsOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../components/AuthContext";



const { Title, Text } = Typography;
const { Header, Sider, Content } = Layout;



const Dashboard: React.FC = () => {

  const headerTitle: {[key: string]: string} = {
    "1": "Dashboard", 
    "2": "Campaigns",
    "3": "Settings"
  }
  


  const [selectedKey, setSelectedKey] = useState<string>("1");

  const [title, setTitle] = useState<string>(headerTitle["1"]);
  const {email, login, logout} = useAuth();
  
  const handleLogout = () => {

    logout();
  }
  
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleLogout} icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );
  
  useEffect( () => {
    login();

  },[]);

  const handleMenuClick = (e: {key: string}) => {
    
    setSelectedKey(e.key);
    setTitle(headerTitle[e.key]);
  }


  return (
    <Layout style={{ minHeight: "100vh", minWidth: "700px" }}>
      <Sider collapsible>
        <div
          className="logo"
          style={{ padding: "16px", textAlign: "center", color: "#fff" }}
        >
          SurgeView
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} selectedKeys ={ [selectedKey]} onClick={handleMenuClick}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<BarsOutlined />}>
            Campaigns
          </Menu.Item>
          <Menu.Item key="3" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: "16px" }}>
            {title}
          </Title>
          <Dropdown 
          dropdownRender={() => (
            <Menu>
              <Menu.Item key="1" onClick={handleLogout} icon={<LogoutOutlined />}>
                Logout
              </Menu.Item>
            </Menu>
          )}
          trigger={['click']}
        >
          <span style={{ marginRight: '35px', marginLeft: 'auto', cursor: 'pointer' }}>
            {email}
          </span>
        </Dropdown>
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
          <DashboardView selectedMenu={selectedKey}/>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
