import React, {createContext, ReactNode, useState} from "react";
import {v4 as uuidv4} from 'uuid';


// Define the structure of signupData
interface SignupData {
    step: number;
    paymentPlanError: string;
    videoLinkError: string;
    contentColumnWidth: string;
    formLoading: boolean;
    clientSecretCreated: boolean;
  }

// Define the structure of the SignupContext
interface SignupContextType {
    signupData: SignupData;
    updateSignupData: (obj: Partial<SignupData>) => void;
    resetSignupData: () => void;
    createSessionKey: (reset: boolean) => string;
}
  
interface SignupProviderProps {
    children: ReactNode;
}

export const SignupContext = createContext<SignupContextType>({
    signupData: {
        step: 1, paymentPlanError: "", videoLinkError: "",
        contentColumnWidth: '75%', formLoading: false, clientSecretCreated: false
   }, 
   updateSignupData: () => {},
   resetSignupData: () => {},
   createSessionKey: () => ""
});




export const SignupProvider = ({ children }: SignupProviderProps) => {
    const [signupData, setSignupData] = useState<SignupData>({
         step: 1, paymentPlanError: "", videoLinkError: "",
         contentColumnWidth: '75%', formLoading: false, clientSecretCreated: false
    });

    const updateSignupData = function (newData: Partial<SignupData> ) {
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