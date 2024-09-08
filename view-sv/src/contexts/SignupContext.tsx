import React, {createContext, useEffect, useState} from "react";

export const SignupContext = createContext({
    signupData: {
        step: 1, paymentPlanError: "", videoLinkError: "",
        contentColumnWidth: '75%', formLoading: false, clientSecretCreated: false
   }, 
   updateSignupData: (obj) => {},
   resetSignupData: () => {},
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

    const updateSignupData = (newData) => {
        setSignupData(prev => ({
            ...prev, 
            ...newData  
        }));
    }
    
    const resetSignupData = () => {
        localStorage.removeItem('lastStepCompleted');
        localStorage.removeItem('campaignId');        
        localStorage.removeItem('pricing');        
        localStorage.removeItem('youtubeUrl');     
    }

    return (
        <SignupContext.Provider value={{signupData, updateSignupData, resetSignupData}}>
            {children}
        </SignupContext.Provider>
    )
}