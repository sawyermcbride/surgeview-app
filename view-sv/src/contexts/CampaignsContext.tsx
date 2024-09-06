import React, {createContext, useEffect, useState} from "react";


const initialCampaignState = {
    campaignsStateData: {
        selectedVideoId: 0,
        loading: false,
        showBreadcrumb: false,
        breadcrumbSecondaryTitle: "",
        breadcrumbLink: "",
        campaignViewSetting: 0
    },
    updateCampaignData: (obj) => {}
};

export const CampaignsContext = createContext(initialCampaignState);

export const CampaignsProvider = ({children}) => {
    const [campaignsStateData, setCampaignsStateData] = useState(initialCampaignState.campaignsStateData);

    const updateCampaignData = (newData) => {
        // console.log("Updating CampaignContext with properties:");
        // console.log(newData);

        setCampaignsStateData( prev => ({
            ...prev, 
            ...newData
        }));
    }

    return (
        <CampaignsContext.Provider value={{campaignsStateData, updateCampaignData}}>
            {children}
        </CampaignsContext.Provider>
    )
}