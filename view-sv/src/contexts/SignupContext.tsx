import React, {createContext, useEffect, useState} from "react";
import {v4 as uuidv4} from 'uuid';

export const SignupContext = createContext({
    signupData: {
        step: 1, paymentPlanError: "", videoLinkError: "",
        contentColumnWidth: '75%', formLoading: false, clientSecretCreated: false
   }, 
   updateSignupData: (obj) => {},
   resetSignupData: () => {},
   createSessionKey: (reset: boolean) => String
});
// export const SignupContext = createContext(null);


export const SignupProvider = ({ children }) => {
    const [signupData, setSignupData] = useState({
         step: 1, paymentPlanError: "", videoLinkError: "",
         contentColumnWidth: '75%', formLoading: false, clientSecretCreated: false
    });
    useEffect(() => {
        // console.log(`New data in SignupProvider: `)
        // console.log(signupData);
    },[signupData]);

    const updateSignupData = function (newData) {
        setSignupData(prev => ({
            ...prev, 
            ...newData  
        }));
    }
    
    const resetSignupData = function () {
        localStorage.removeItem('lastStepCompleted');
        localStorage.removeItem('campaignId');        
        localStorage.removeItem('pricing');        
        localStorage.removeItem('youtubeUrl');
        localStorage.removeItem('sessionKey');
    }

    const createSessionKey = function(reset: boolean) {
        const currentValue = localStorage.getItem('sessionKey');
        console.log("Creating Session Key");
        
        if(!currentValue || reset) {
            const key = uuidv4();
            localStorage.setItem('sessionKey', key);
            return key;
        } else {
            return currentValue;
        }
    }

    return (
        <SignupContext.Provider value={{signupData, updateSignupData, resetSignupData, createSessionKey}}>
            {children}
        </SignupContext.Provider>
    )
}