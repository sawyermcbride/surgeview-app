import React, {createContext, useEffect, useState} from "react";

export const SignupContext = createContext({
    signupData: {
        step: 1, paymentPlanError: "", videoLinkError: "",
        contentColumnWidth: '75%', formLoading: false
   }, 
   updateSignupData: (obj) => {}
});
// export const SignupContext = createContext(null);

export const SignupProvider = ({ children }) => {
    const [signupData, setSignupData] = useState({
         step: 1, paymentPlanError: "", videoLinkError: "",
         contentColumnWidth: '75%', formLoading: false
    });
    useEffect(() => {
        // console.log(`New data in SignupProvider: `)
        // console.log(signupData);
    },[signupData]);

    const updateSignupData = (newData) => {
        setSignupData(prev => ({
            ...prev, 
            ...newData  
        }))
    }

    return (
        <SignupContext.Provider value={{signupData, updateSignupData}}>
            {children}
        </SignupContext.Provider>
    )
}