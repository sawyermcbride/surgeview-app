/**
 * Dashboard context 
 */
import React, {createContext, useEffect, useState} from "react";
import {v4 as uuidv4} from 'uuid';

const initialDashboardState= {
  dashboardState: {
    loading: false
  },
  updateDashboardData: (obj) => {},
  createSessionKey: () => ""
}


export const DashboardContext = createContext(initialDashboardState);

export const DashboardProvider = function({children}) {
  const [dashboardState, setDashboardState] = useState(initialDashboardState);

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
      {children}
    </DashboardContext.Provider>
  )
}