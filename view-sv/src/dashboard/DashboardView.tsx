import React, { useState, useEffect } from "react";
import BaseStatistics from "./BaseStatistics";
import CampaignsView from "./CampaignsView";
import { useAuth } from "../components/AuthContext";
import {CampaignsProvider } from "../contexts/CampaignsContext";
import SettingsView from "./SettingsView";
import { Spin } from "antd";
import api from "../utils/apiClient";
import {useQuery} from "@tanstack/react-query";
import {CampaignResponse, StatisticsResponse} from "../interfaces/apiResponses";

interface DashboardViewProps {
  selectedMenu: string
  resetCampaignsView: boolean,
  resetDashboardView: boolean,
  isMobile: boolean | undefined,
  setResetCampaignsView: (arg: boolean) => void,
  setResetDashboardView: (arg: boolean) => void,
}

const fetchCampaigns = async function(token: string | null) {
  const result = await api.get("http://10.0.0.47:3001/campaign/request", {
    headers:{
      Authorization: `Bearer ${token}`
    }
  } );
  return result.data;
}

const fetchStatistics = async function(token: string | null) {
  const result = await api.get("http://10.0.0.47:3001/campaign/statistics", {
    headers:{
      Authorization: `Bearer ${token}`
    }
  });
  return result.data;
}

const DashboardView: React.FC<DashboardViewProps> = (props) => {
  const {token} = useAuth();
  const [campaignData, setCampaignData] = useState<CampaignResponse[] | null>(null);

  const [campaignStatistics, setCampaignStatistics] = useState<StatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  
  
  const { isPending: isCampaignsLoading, isError: isCampaignsError, data: campaignsData, refetch: refetchCampaigns } =  useQuery<CampaignResponse[]>({
    queryKey: ['campaigns', token],
    queryFn: () => fetchCampaigns(token),
    enabled: !!token,
    refetchOnMount: true, 
  });
  
  const { isPending: isStatisticsLoading, isError: isStatisticsError, data: statisticsData, refetch: refetchStatistics } = useQuery<StatisticsResponse>({
    queryKey: ['statistics', token],
    queryFn: () => fetchStatistics(token),
    enabled: !!token,
    refetchOnMount: true, 
  });

  
  const loadCampaignData = async () => {
      refetchCampaigns();
      refetchStatistics();
      setLoading(true);
      setCampaignStatistics(statisticsData || null);
      setCampaignData(campaignsData || null);
      props.setResetDashboardView(false);

      setTimeout( () => {
        setLoading(false);
      },500);

  }


  useEffect( () => {
    loadCampaignData();
  }, [props.resetCampaignsView, props.resetDashboardView, isStatisticsLoading, isCampaignsLoading]);


  const renderView = () => {
    if(isCampaignsError || isStatisticsError) {
      return <h2>Error</h2>
    };


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
              loading={isCampaignsLoading || isStatisticsLoading}
            />
          </CampaignsProvider>
        )

      case "3":
        return (
          <SettingsView/>
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
