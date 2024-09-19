import React, {useEffect, useState, useContext} from "react";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { SignupContext } from "../../contexts/SignupContext";

import api from "../../utils/apiClient";

import PaymentForm from "../PaymentForm";

const stripePromise = loadStripe("pk_test_51PmqG6KG6RDK9K4gUxR1E9XN8qvunE6UUfkM1Y5skfm48UnhrQ4SjHyUM4kAsa4kpJAfQjANu6L8ikSnx6qMu4fY00I6aJBlkG");

const PaymentPage: React.FC = () => {
    const {signupData, updateSignupData, resetSignupData, createSessionKey} = useContext(SignupContext);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const priceList: Record<string, number> = {Pro: 399, Premium: 199, Standard: 99};

    const fetchClientSecret = async(price: number) => {
      console.log(`fetchClientSecretCalled, createdClientSecret = ${signupData.clientSecretCreated}`);

      try {

        const campaignId = localStorage.getItem("campaignId");
        const sessionKey = localStorage.getItem("sessionKey");
        const token = localStorage.getItem("token");
  
        if(!price || !campaignId ) {
          updateSignupData({})
        }
        if(signupData.clientSecretCreated) {
          return;
        }

        const response = await api.post("http://10.0.0.47:3001/payment/create", {
          plan_name: localStorage.getItem("pricing"),
          amount: price,
          currency: 'usd',
          campaignId
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            SessionKey: sessionKey
          },
        });
        
        const data = response.data;              
        
        console.log(data);
        
        updateSignupData({clientSecretCreated: true});
        console.log(`Data recieved in fetchClientSecret, clientSecretCreated set to true`);

        return {success: true, clientSecret: data.clientSecret};
  
      } catch(error) {
          // Type guard to check if it's an Axios error and has a status of 409
          if (error.response?.status === 409) {
            // Do nothing or return silently, effectively ignoring this error
            console.log('Duplicate request, ignoring.');
            return { success: false }; // Optional: you can choose to return or continue
          } else {
            console.error("Error fetching client secret");
            updateSignupData({ step: 1 });
            resetSignupData();
            createSessionKey(true);
          }

          return { success: false };
      }
    }

    useEffect( () => {
      const initializeConditions = async() => {
        console.log(`In initialize conditions, signupData.clientSecretCreated = ${signupData.clientSecretCreated} `);
        if(signupData.step === 3 && !signupData.clientSecretCreated) {
          
          const localStoragePlan: string | null = localStorage.getItem("pricing");

          if(!localStoragePlan) {
            return;
          }

          const price = priceList[localStoragePlan];
          const result = await fetchClientSecret(price);
          if(result?.success) {
            setClientSecret(result.clientSecret);
          }
        }

      }

      initializeConditions();

    }, [signupData.step])


    const onSubmit = () => {
      window.localStorage.setItem("lastStepCompleted", "3");
    }

    return (
      // <Elements stripe={stripePromise} options={{mode: "setup", currency: "usd"}}>
      clientSecret ? (
        <Elements stripe={stripePromise} options={{clientSecret}}>
          <div style={{marginTop: "10%"}}>
            <PaymentForm onPaymentSuccess={onSubmit} clientSecret={clientSecret} />
          </div>
        </Elements>
      ) : (null)
    )
}

export default PaymentPage;