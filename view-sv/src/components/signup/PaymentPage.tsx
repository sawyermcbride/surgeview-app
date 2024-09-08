import React, {useEffect, useState, useContext} from "react";

import { PaymentElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { SignupContext, SignupProvider } from "../../contexts/SignupContext";
import api from "../../utils/apiClient";

import PaymentForm from "../PaymentForm";

const stripePromise = loadStripe("pk_test_51PmqG6KG6RDK9K4gUxR1E9XN8qvunE6UUfkM1Y5skfm48UnhrQ4SjHyUM4kAsa4kpJAfQjANu6L8ikSnx6qMu4fY00I6aJBlkG");

const PaymentPage: React.FC = () => {
    const {signupData, updateSignupData, resetSignupData} = useContext(SignupContext);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const priceList = {Pro: 399, Premium: 199, Standard: 99};

    const fetchClientSecret = async(price: number) => {
      console.log(`fetchClientSecretCalled, createdClientSecret = ${signupData.clientSecretCreated}`);

      try {

        const campaignId = localStorage.getItem("campaignId");

  
        if(!price || !campaignId ) {
          updateSignupData({})
        }
        if(signupData.clientSecretCreated) {
          return;
        }
        console.log(`Making payment create request with data: `)
        console.log({ amount: price, currency: 'usd', campaignId});


        const response = await api.post("http://10.0.0.47:3001/payment/create", {
          amount: price,
          currency: 'usd',
          campaignId
        });
        
        const data = response.data;              
        
        console.log(data);
        
        updateSignupData({clientSecretCreated: true});
        console.log(`Data recieved in fetchClientSecret, clientSecretCreated set to true`);

        // console.log(`Client secret response - ${data.clientSecret}`);
        return {success: true, clientSecret: data.clientSecret};
  
      } catch(error) {
        console.log(error);
        if(error.response.status === 409) {
          console.log('duplicate request handled');
        } else {
          console.error("Error fetching client secret");
          updateSignupData({step: 1});
          resetSignupData();
        }
        return {success: false}
      }
    }

    useEffect( () => {
      const initializeConditions = async() => {
        console.log(`In initialize conditions, signupData.clientSecretCreated = ${signupData.clientSecretCreated} `);
        if(signupData.step === 3 && !signupData.clientSecretCreated) {
          const price = priceList[localStorage.getItem("pricing")];
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