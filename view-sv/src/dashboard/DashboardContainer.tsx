import React from "react";
import { DashboardProvider } from "../contexts/DashboardContext";
import Dashboard from "../pages/Dashboard";

const DashboardContainer: React.FC = function() {
  return (
    <DashboardProvider>
      <Dashboard/>
    </DashboardProvider>
  )
}

export default DashboardContainer;