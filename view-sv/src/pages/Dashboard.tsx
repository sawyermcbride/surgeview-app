// src/components/Dashboard/Dashboard.tsx
import React, { useContext, useEffect, useState } from "react";
import DashboardView from "../dashboard/DashboardView";

import { Layout, Menu, Button, Typography, Dropdown, Drawer } from "antd";
import { HomeOutlined, BarsOutlined, SettingOutlined, LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import { useAuth } from "../components/AuthContext";
import { DashboardContext } from "../contexts/DashboardContext";
import CustomFooter from "../components/CustomFooter";
import { AppMainProvider } from "../contexts/AppMainContext";

const { Title } = Typography;
const { Header, Sider, Content, Footer } = Layout;


/**
 * 9/22 2:15am 
 *  Add dashboard context property for loading so it can be called in settings form
 */

const Dashboard: React.FC = () => {
  const {dashboardState, updateDashboardData} = useContext(DashboardContext);

  const headerTitle: {[key: string]: string} = {
    "1": "Dashboard", 
    "2": "Campaigns",
    "3": "Settings"
  }
  
  

  const [resetCampaignsView, setResetCampaignsView] = useState(false);
  const [resetDashboardView, setResetDashboardView] = useState(false);

  const [selectedKey, setSelectedKey] = useState<string>("1");

  const [title, setTitle] = useState<string>(headerTitle["1"]);
  const {email, login, logout} = useAuth();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  const handleLogout = () => {

    logout();
  }
  
  const handleDrawerOpen = () => {
    setDrawerVisible(true);
  }
  const handleDrawerClose = () => {
    setDrawerVisible(false);
  }

  useEffect( () => {
    window.addEventListener('resize', () => {
        setIsMobile(window.innerWidth < 800);
    });

    login();

  },[]);

  const handleMenuClick = (e: {key: string}) => {
    setSelectedKey(e.key);
    setTitle(headerTitle[e.key]);
    setDrawerVisible(false);
  }

  const handleCampaignsClick = () => {
    setResetCampaignsView(true);
  }

  const handleDashboardClick = () => {
    
    setResetDashboardView(true);
  }

  const renderMenu = () => {

    if(isMobile) {
      return (
          <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]} selectedKeys ={ [selectedKey]} onClick={handleMenuClick}>
            <Menu.Item key="1" onClick={handleDashboardClick} icon={<HomeOutlined />}>
              Dashboard
            </Menu.Item>
            <Menu.Item key="2" onClick={handleCampaignsClick} icon={<BarsOutlined />}>
              Campaigns
            </Menu.Item>
            <Menu.Item key="3" icon={<SettingOutlined />}>
              Settings
            </Menu.Item>
          </Menu>
        )
    } else {
      return (
        // <Menu mode="inline" style={{backgroundColor: "#e64f40"}}
        <Menu mode="inline" style={{backgroundColor: "#F9F9F9", border: "0px", color: "#fff"}}
          defaultSelectedKeys={["1"]} selectedKeys ={ [selectedKey]} onClick={handleMenuClick}>
          <Menu.Item  key="1" onClick={handleDashboardClick} icon={<HomeOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" onClick={handleCampaignsClick} icon={<BarsOutlined />}>
            Campaigns
          </Menu.Item>
          <Menu.Item key="3" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
        </Menu>
      )
    }
  }


    return (
      <Layout style={{ minHeight: "100vh", minWidth: "500px" }}>
        <Layout>
        {
          isMobile ? (
            <>
              <Drawer
                  title="SurgeView"
                  placement="left"
                  onClose={handleDrawerClose}
                  open={drawerVisible}
                  style={{ padding: 0 }}
              >
                  {renderMenu()}
              </Drawer>
              <Button
                  className="menu-toggle"
                  style={{ display: (isMobile ? 'inline-block': 'none'), position: 'absolute', top: 16, left: 16, zIndex: 1000 }}
                  type="primary"
                  icon={<MenuOutlined />}
                  onClick={handleDrawerOpen}
              />
            </>
          ) : (
            // <Sider style={{ background: "#ecf0f1"}}>
            // <Sider style={{ background: "#666666"}}>
            <Sider style={{ background: "#F9F9F9", borderRight: "2px solid #D3D3D3"}}>
              <div
                className="logo"
                style={{ padding: "5px", textAlign: "center", backgroundColor: "#F9F9F9" }}
              >
                <img src="surge_view_new_cropped_transparent.png" alt="Logo" style={{ height: '40px', marginTop: '10px', marginBottom: '5px' }}/>
              </div>
              {renderMenu()}
            </Sider>
            
          )
        }
        <Layout style={{backgroundColor: '#F9F9F9'}}>
          <Header style={{ background: "#F9F9F9", padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={2} style={{ marginTop: "16px", marginRight: "16px", marginBottom: "16px", marginLeft: (isMobile ? "70px" : "16px") }}>
              {title}
            </Title>
            <Dropdown 
            dropdownRender={() => (
              <Menu>
                <Menu.Item key="2" onClick={handleLogout} icon={<LogoutOutlined />}>
                  Settings
                </Menu.Item>
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
              margin: "0px 0px",
              padding: 24,
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flext-start",
              paddingTop: "25px",
              borderRadius: "5px"
            }}
          >
            <DashboardView isMobile={isMobile} resetCampaignsView = {resetCampaignsView} setResetCampaignsView = {setResetCampaignsView}
            selectedMenu={selectedKey} setResetDashboardView={setResetDashboardView} resetDashboardView={resetDashboardView}/>

          </Content>
        </Layout>
        </Layout>
        <CustomFooter/>
      </Layout>    

  );
};

export default Dashboard;
