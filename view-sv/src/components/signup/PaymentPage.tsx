import React, {useEffect, useState, useContext} from "react";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { SignupContext } from "../../contexts/SignupContext";

import api from "../../utils/apiClient";

import PaymentForm from "../PaymentForm";
import { isAxiosError } from "axios";

const stripePromise = loadStripe("pk_test_51PmqG6KG6RDK9K4gUxR1E9XN8qvunE6UUfkM1Y5skfm48UnhrQ4SjHyUM4kAsa4kpJAfQjANu6L8ikSnx6qMu4fY00I6aJBlkG");

const PaymentPage: React.FC = () => {
    const {signupData, updateSignupData, resetSignupData, createSessionKey} = useContext(SignupContext);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const priceList: Record<string, number> = {Pro: 399, Premium: 199, Standard: 99};

    const fetchClientSecret = async(price: number) => {
      console.log(`fetchClientSecretCalled, createdClientSecret = ${signupData.clientSecretCreated}`);

      try {
        const sessionKey = localStorage.getItem("sessionKey");
        const token = localStorage.getItem("token");

        const response = await api.post("http://10.0.0.47:3001/payment/create", {
          plan_name: signupData.pricing,
          amount: price,
          currency: 'usd',
          campaignId: signupData.campaignId
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            SessionKey: sessionKey
          },
        });
        
        const data = response.data;              
        
        console.log(data);
        
        updateSignupData({clientSecretCreated: true});

        return {success: true, clientSecret: data.clientSecret};
  
      } catch(error) {
          // Type guard to check if it's an Axios error and has a status of 409
          if (isAxiosError(error) && error.response?.status === 409) {
            // Do nothing or return silently, effectively ignoring this error
            return { success: false }; // Optional: you can choose to return or continue
          } else {
            console.error("Error fetching client secret");
            console.error(error);
            updateSignupData({ step: 1, lastStepCompleted: 0 });
            resetSignupData();
            createSessionKey(true);
          }

          return { success: false };
      }
    }

    useEffect( () => {
      const initializeConditions = async() => {
        if(signupData.step !== 3) {
          return;
        }

        if(signupData.step === 3) {
          
          const storedPlan: string | null = signupData.pricing;

          if(!storedPlan) {
            return;
          }

          const price = priceList[storedPlan];
          const result = await fetchClientSecret(price);
          if(result?.success) {
            setClientSecret(result.clientSecret);
          }
        }

      }

      initializeConditions();

    }, [signupData.step]);


    const onSubmit = () => {
      updateSignupData({step: 3});
    }

    return (
      // <Elements stripe={stripePromise} options={{mode: "setup", currency: "usd"}}>
      clientSecret ? (
        <Elements stripe={stripePromise} options={{clientSecret}}>
          <div style={{marginTop: "5%"}}>
            <PaymentForm onPaymentSuccess={onSubmit} clientSecret={clientSecret} />
          </div>
        </Elements>
      ) : (null)
    )
}

export default PaymentPage;