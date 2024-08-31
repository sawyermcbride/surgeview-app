import React, { useState, useEffect } from "react";
import BaseStatistics from "./BaseStatistics";
import CampaignsView from "./CampaignsView";
import { useAuth } from "../components/AuthContext";
import axios from "axios";

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
import api from "../utils/apiClient";


const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

interface DashboardViewProps {
  selectedMenu: string
}

const DashboardView: React.FC<DashboardViewProps> = (props) => {
  const {login, logout, isAuthenticated, token} = useAuth();
  const [campaignData, setCampaignData] = useState(null);
  const [campaignStatistics, setCampaignStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCampaignData = async () => {
    try {
        await login();
        console.log("loading campaigns");
        console.log(token);
        const result = await api.get("http://10.0.0.47:3001/campaign/request", {
            headers:{
                Authorization: `Bearer ${token}`
            }
        } );
        setCampaignStatistics(["data"]);
        setCampaignData(result.data);

        console.log(result.data);
    } catch(err) {
        console.log(err);
        console.log("error in loadCampaignData")
        setError(err);
    } finally {
        setLoading(false);
    }
  }

  useEffect( () => {
    loadCampaignData();

  }, []);

  const renderView = () => {
    switch (props.selectedMenu) {
      case "1":
        return (
          <BaseStatistics loading={loading} campaignStatistics = {campaignStatistics}  />
        );
      case "2":
        return(
          <CampaignsView 
            campaignData = {campaignData}
            campaignStatistics = {campaignStatistics}
          />
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
