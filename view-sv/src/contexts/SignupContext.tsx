import {createContext, ReactNode, useState} from "react";
import {v4 as uuidv4} from 'uuid';
import useLocalStorage from "../hooks/useLocalStorage";
import { Sign } from "crypto";

// Define the structure of signupData
interface SignupData {
    step: number;
    lastStepCompleted: number;
    campaignId: number;
    pricing: string;
    youtubeUrl: string;
    paymentPlanError: string;
    videoLinkError: string;
    contentColumnWidth: string;
    formLoading: boolean;
    clientSecretCreated: boolean;
    videoTitle: string;
    channelTitle: string;
    isUpdating: boolean;
    highestStepCompleted: number;
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

const initialState: SignupData = {
    step: 0, paymentPlanError: "", videoLinkError: "",
    contentColumnWidth: '75%', formLoading: false, clientSecretCreated: false, 
    videoTitle: "", channelTitle: "", lastStepCompleted: 0, campaignId: 0, pricing: "",
    youtubeUrl: "", isUpdating: false, highestStepCompleted: 0
}


export const SignupContext = createContext<SignupContextType>({
    signupData: initialState,   
   updateSignupData: () => {},
   resetSignupData: () => {},
   createSessionKey: () => "",
});




export const SignupProvider = ({ children }: SignupProviderProps) => {
    const [signupData, setSignupData] = useLocalStorage<SignupData>('signupData', initialState);
    // const [signupData, setSignupData] = useState<SignupData>(initialState);

    
    const updateSignupData = function (newData: Partial<SignupData> ) {

        setSignupData((prev: SignupData) => {
            console.log('Prev', prev);
            console.log('New', newData);
            console.log('Merged', {...prev, ...newData});

            return {
            ...prev,
            ...newData
            }
        }
        );
    }

    
    const resetSignupData = function () {
        localStorage.removeItem('signupData');
        localStorage.removeItem('sessionKey');
    }

    
    const createSessionKey = function(reset: boolean) {
        const currentValue = localStorage.getItem('sessionKey');
        
        
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