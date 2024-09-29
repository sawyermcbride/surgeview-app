import React, {useState, useEffect, useContext} from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { Form, Button, Row, Col, Typography, Alert} from "antd";

import api from "../utils/apiClient";

import { useNavigate } from "react-router";
import { SignupContext } from "../contexts/SignupContext";
// import { AppMainContext } from "../contexts/AppMainContext";

const {Title, Text} = Typography;



type PaymentFormProps = {
    handlePaymentFormReady: () => void;
    clientSecret: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({handlePaymentFormReady, clientSecret}) => {
  const stripe = useStripe();
  const elements = useElements();
  // const appContext = useContext(AppMainContext)

  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [status, setStatus] = useState("default");
  // const [intentId, setIntentId] = useState(null);

  const {resetSignupData} = useContext(SignupContext);

  const navigate = useNavigate();

  useEffect( () => {
    

    if (!stripe || !clientSecret) {
      return;
    }

  },[])


  const paymentElementOptions = {
    // style: {
    //   base: {
    //     color: '#32325d',
    //     fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    //     fontSmoothing: 'antialiased',
    //     fontSize: '16px',
    //     '::placeholder': {
    //       color: '#aab7c4',
    //     },
    //     backgroundColor: 'white', // Set background to white
    //   },
    //   invalid: {
    //     color: '#fa755a',
    //     iconColor: '#fa755a',
    //   },
    // },
  };


  const onSubmit = async () => {
    

    if (!stripe || !elements) {
      return;
    }
    try {
      setLoading(true);
      const {error, paymentIntent} = await stripe.confirmPayment({
        elements, 
        redirect: "if_required",
        confirmParams: {
          return_url: 'http://10.0.0.47:3001/payment/confirm'
        }
      })  
      setLoading(false);
      if(error) {
          setShowMessage(true);
          setMessage(error.message || "Error processing payment");
      } else if(paymentIntent && paymentIntent.status === 'succeeded') {
          setSuccessMessage(true);
          setShowMessage(true)
          setMessage("Payment successful. Redirecting to dashboard...");

          const sessionKey = localStorage.getItem('sessionKey');
          const token = localStorage.getItem('token');
          
          if(!token || !sessionKey) {
            console.error("missing token or session key, redirect to start");
          }
          const result = await api.post('http://10.0.0.47:3001/payment/update-payment', {
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            status: paymentIntent.status,
          },  {
            headers: {
              Authorization: `Bearer ${token}`,
              SessionKey: sessionKey
            },
          })
          
          resetSignupData();
          setTimeout( () => {
            navigate('/dashboard');
          }, 1000);
          
          console.log(result);
      }

    } catch(error){
      setLoading(false);
      console.error(error);
    }
    // Create a payment method with the card details
  };

  return (
    <>
    {showMessage && (
      <Alert
        message={message}
        type= {(successMessage ? 'success' : 'error')}
        showIcon
        style={{marginBottom: "40px"}}
      />
    )}
      <Row>
        <Col lg={12} sm={24} style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <Form onFinish={onSubmit} layout="vertical">
          <Form.Item label="Card Information">
            <PaymentElement onReady={handlePaymentFormReady}  id='payment-element' options={paymentElementOptions}/>
          </Form.Item>
          <Form.Item>
            <Button size="large" type="primary" htmlType="submit" disabled={loading || !stripe || !elements}>
              Complete Signup
            </Button>
          </Form.Item>
        </Form>
        </Col>
        <Col lg={12} sm={24}>
          <div style={{padding: "25px 50px" }}>
            <Title level={4}>Last Step! Start Getting New Views Today!</Title>
            <Text style={{fontSize: "18px"}}>Compete signup to start marketing your video today. 
              Manage your campaign and view results within our highly advanced software. <br/><br/>
              You can easily cancel at anytime in your account. So no worry about extra charges!! </Text>
          </div>
        </Col>
      </Row>

    </>
  );
};

export default PaymentForm;
