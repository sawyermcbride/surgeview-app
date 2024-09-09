import React, {createContext, useEffect, useState} from "react";

const initialCampaignState = {
  dashboardState: {},
  updateDashboardData: (pbj) => {}
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
  
  return (
    <DashboardContext.Provider value={{dashboardState, updateDashboardData}}>

    </DashboardContext.Provider>
  )
}