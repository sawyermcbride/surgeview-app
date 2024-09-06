import React, { useState, useEffect } from "react";
import BaseStatistics from "./BaseStatistics";
import CampaignsView from "./CampaignsView";
import { useAuth } from "../components/AuthContext";
import {CampaignsProvider } from "../contexts/CampaignsContext";
import axios from "axios";

import { Spin } from "antd";

import api from "../utils/apiClient";

interface DashboardViewProps {
  selectedMenu: string
  resetCampaignsView: boolean,
  resetDashboardView: boolean,
  isMobile: boolean,
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
      
      const lastCampaignRefresh = localStorage.getItem("lastCampaignRefresh");
      let statisticsResult: object;
      let shouldRefresh: boolean = true;
        
        setLoading(true);

        const result = await api.get("http://10.0.0.47:3001/campaign/request", {
          headers:{
            Authorization: `Bearer ${token}`
          }
        } );
        

        if(lastCampaignRefresh) {
          const storedTime = parseInt(lastCampaignRefresh, 10);
          const currentTime = Date.now();

          const timeDiff = currentTime - storedTime;
          const minutes = Math.floor(timeDiff / (1000 * 60));
          shouldRefresh = (minutes >= 5);
          console.log(`Should refresh value = ${shouldRefresh} and minutes since last refresh = ${minutes}`);
        } 


        if(shouldRefresh) {
          console.log("Making statistics request");
          const requestResult = await api.get("http://10.0.0.47:3001/campaign/statistics", {
            headers:{
              Authorization: `Bearer ${token}`
            }
          });

          statisticsResult = requestResult.data;

          localStorage.setItem("lastCampaignRefresh", Date.now().toString());
          localStorage.setItem("statisticsData", JSON.stringify(statisticsResult));
          shouldRefresh = false;
          
        } else {
          statisticsResult = JSON.parse(localStorage.getItem("statisticsData"));
        }

        localStorage.setItem("campaignData", JSON.stringify(result.data));

        setCampaignStatistics(statisticsResult);
        setCampaignData(result.data);
        props.setResetDashboardView(false);
        // console.log("New campaigns data loaded");
        // console.log(result.data);
    } catch(err) {

        setError(err);
    } finally {
        setTimeout( () => {
          setLoading(false);
        },500);
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
              <Spin data-testid="spinner" size="large" style={{marginTop: "25px"}}/>
            </div>
          )
        } else {
          return (
            <BaseStatistics isMobile={props.isMobile} loading={loading} campaignStatistics = {campaignStatistics}  />
          );
        }
      case "2":
        return(
          <CampaignsProvider>
            <CampaignsView 
              campaignData = {campaignData}
              campaignStatistics = {campaignStatistics}
              isMobile={props.isMobile}
              resetCampaignsView = {props.resetCampaignsView}
              setResetCampaignsView={props.setResetCampaignsView}
              loadCampaignData = {loadCampaignData}
              loading={loading}
            />
          </CampaignsProvider>
        )

      case "3":
        return (
          <div>
            
          </div>
        )
        
    }
  };

  return ( 
    <div style={{width: "100%"}} >
        {renderView()}
    </div>
  )
};

export default DashboardView;
