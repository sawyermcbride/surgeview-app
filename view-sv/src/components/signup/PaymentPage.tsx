import React, {useEffect, useState, useContext} from "react";

import { PaymentElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { SignupContext, SignupProvider } from "../../contexts/SignupContext";
import api from "../../utils/apiClient";

import PaymentForm from "../PaymentForm";

const stripePromise = loadStripe("pk_test_51PmqG6KG6RDK9K4gUxR1E9XN8qvunE6UUfkM1Y5skfm48UnhrQ4SjHyUM4kAsa4kpJAfQjANu6L8ikSnx6qMu4fY00I6aJBlkG");

const PaymentPage: React.FC = () => {
    const {signupData, updateSignupData} = useContext(SignupContext);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const priceList = {Pro: 399, Premium: 199, Standard: 99};

    const fetchClientSecret = async(price: number) => {

      try {

        const campaignId = localStorage.getItem("campaignId");

  
        if(!price || !campaignId ) {
          updateSignupData({})
        }
  
        const response = await api.post("http://10.0.0.47:3001/payment/create", {
          amount: price,
          currency: 'usd',
          campaignId
        });
        
        const data = response.data;              
        // console.log(`Client secret response - ${data.clientSecret}`);
        return data.clientSecret;
  
      } catch(error) {
        console.error("Error fetching client secret");
        updateSignupData("An Error Occured");
      }
    }

    useEffect( () => {
      const initializeConditions = async() => {
        if(signupData.step === 3) {
          const price = priceList[localStorage.getItem("pricing")];
          const result = await fetchClientSecret(price);
          setClientSecret(result);
        }

      }

      initializeConditions();

    }, [signupData.step])


    const onSubmit = () => {
      alert("submitcalled");
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