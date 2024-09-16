/**
 * Dashboard context 
 */
import React, {createContext, useEffect, useState} from "react";
import {v4 as uuidv4} from 'uuid';

const initialCampaignState = {
  dashboardState: {},
  updateDashboardData: (obj) => {},
  createSessionKey: () => void
}


export const DashboardContext = createContext(initialCampaignState);

export const DashboardProvider = function({children}) {
  const [dashboardState, setDashboardState] = useState(initialCampaignState);

  const updateDashboardData = function(newData) {
    setDashboardState(prev => ({
      ...prev,
      ...newData
    }))
  }

  const createSessionKey = function() {
    return uuidv4();
  }
  
  return (
    <DashboardContext.Provider value={{dashboardState, updateDashboardData, createSessionKey}}>

    </DashboardContext.Provider>
  )
}