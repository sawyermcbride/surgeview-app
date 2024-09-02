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
  Breadcrumb,
  Spin
} from "antd";
import { HomeOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";
import api from "../utils/apiClient";


const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

interface DashboardViewProps {
  selectedMenu: string
  resetCampaignsView: boolean,
  resetDashboardView: boolean,
  setResetCampaignsView: (arg: boolean) => void,
  setResetDashboardView: (arg: boolean) => void,
}

const DashboardView: React.FC<DashboardViewProps> = (props) => {
  const {login, logout, isAuthenticated, token} = useAuth();
  const [campaignData, setCampaignData] = useState(null);
  const [campaignStatistics, setCampaignStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCampaignData = async () => {
    try {
        // await login();
        setLoading(true);

        const lastCampaignRefresh = localStorage.getItem("lastCampaignRefresh");
        if(lastCampaignRefresh) {
          const storedTime = parseInt(lastCampaignRefresh, 10);
          const currentTime = Date.now();

          const timeDiff = currentTime - storedTime;
          const minutes = Math.floor(timeDiff / (1000 * 60));
          if(minutes < 6) {
            console.log("Short refresh");
          }
        } 


        const result = await api.get("http://10.0.0.47:3001/campaign/request", {
            headers:{
                Authorization: `Bearer ${token}`
            }
        } );

        const statisticsResult = await api.get("http://10.0.0.47:3001/campaign/statistics", {
          headers:{
            Authorization: `Bearer ${token}`
          }
        })

        localStorage.setItem("statisticsData", JSON.stringify(statisticsResult.data));
        localStorage.setItem("campaignData", JSON.stringify(result.data));

        setCampaignStatistics(statisticsResult.data);
        setCampaignData(result.data);
        props.setResetDashboardView(false);
        // console.log("New campaigns data loaded");
        // console.log(result.data);
    } catch(err) {

        setError(err);
    } finally {
        setTimeout( () => {
          setLoading(false);
        },1500);
    }
  }


  useEffect( () => {
    loadCampaignData();
  }, [props.resetCampaignsView, props.resetDashboardView]);

  const renderView = () => {
    switch (props.selectedMenu) {
      case "1":
        if(loading) {
          return (
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Spin size="large" style={{marginTop: "25px"}}/>
            </div>
          )
        } else {
          return (
            <BaseStatistics loading={loading} campaignStatistics = {campaignStatistics}  />
          );
        }
      case "2":
        return(
          <CampaignsView 
            campaignData = {campaignData}
            campaignStatistics = {campaignStatistics}
            resetCampaignsView = {props.resetCampaignsView}
            setResetCampaignsView={props.setResetCampaignsView}
            loadCampaignData = {loadCampaignData}
          />
        )

      case "3":
        return (
          <div>
            
          </div>
        )
        
    }
  };

  return ( 
    <div style={{width: "90%"}} >
        {renderView()}
    </div>
  )
};

export default DashboardView;
