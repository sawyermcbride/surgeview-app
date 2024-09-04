import React, {useState, useEffect} from "react";
import { PaymentElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { Form, Input, Button, Row, Col, Typography, Alert } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import api from "../utils/apiClient";
import { useStripeContext } from "../contexts/StripeContext";


const {Title, Paragraph, Text} = Typography;

const stripePromise = loadStripe("pk_test_51PmqG6KG6RDK9K4gUxR1E9XN8qvunE6UUfkM1Y5skfm48UnhrQ4SjHyUM4kAsa4kpJAfQjANu6L8ikSnx6qMu4fY00I6aJBlkG");

type PaymentFormProps = {
    onPaymentSuccess: (a: any) => void;
    clientSecret: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({onPaymentSuccess, clientSecret}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [showMessage, setShowMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("default");
  const [intentId, setIntentId] = useState(null);


  useEffect( () => {
    

    if (!stripe || !clientSecret) {
      return;
    }



    stripe.retrievePaymentIntent(clientSecret).then(({paymentIntent}) => {
      if (!paymentIntent) {
        return;
      }

      setStatus(paymentIntent.status);
      setIntentId(paymentIntent.id);
    })
    .catch(err => {
      console.error(err);
      setShowMessage(true);
      setErrorMessage(err);
    })

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


  const onSubmit = async (values: any) => {
    if (!stripe || !elements) {
      return;
    }
    try {
      setLoading(true);
      const {error} = await stripe.confirmPayment({
        elements, 
        redirect: "if_required",
        confirmParams: {
          return_url: 'http://10.0.0.47:3001/payment/confirm'
        }
      })  
      setLoading(false);
      if(error) {
          setShowMessage(true);
          setErrorMessage(error.message);
      } else {
        setShowMessage(true);
        setErrorMessage(error.message);
      }

    } catch(error){
      console.error(error);
    }
    // Create a payment method with the card details
  };

  return (
    <>
    {showMessage && (
      <Alert
        message={errorMessage}
        type="error"
        showIcon
        style={{marginBottom: "40px"}}
      />
    )}

      <Row>
        <Col lg={12} sm={24}>
          <Form onFinish={onSubmit} layout="vertical">
            <Form.Item label="Card Information">
              <PaymentElement  id='payment-element' options={paymentElementOptions}/>
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
            <Title level={4}>Start Getting New Views Today</Title>
            <Text style={{fontSize: "18px"}}>Compete signup to start marketing your video today. 
              Manage your campaign and view results within our software. <br/><br/>
              You can easily cancel at anytime in your account. </Text>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default PaymentForm;
