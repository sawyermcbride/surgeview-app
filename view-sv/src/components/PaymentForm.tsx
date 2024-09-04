import React, {useState, useEffect} from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";


import { Form, Input, Button, Row, Col, Typography, Alert } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import api from "../utils/apiClient";
import { useStripeContext } from "../contexts/StripeContext";


const {Title, Paragraph, Text} = Typography;



type PaymentFormProps = {
    onPaymentSuccess: (a: any) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({onPaymentSuccess}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [showMessage, setShowMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, isLoading] = useState(false);
  const [status, setStatus] = useState("default");
  const [intentId, setIntentId] = useState(null);

  const {clientSecret, fetchClientSecret} = useStripeContext();

  useEffect( () => {

    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    fetchClientSecret(99);

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

    // Create a payment method with the card details
    const {error} = await stripe.confirmPayment({
      elements, 
      confirmParams: {
        return_url: 'http://10.0.0.47:5173/dashboard'
      }
    })

    if (error) {
      console.error(error);
    } else {
      console.log("Payment Method Created:", paymentMethod);
      onPaymentSuccess("");
    }
  };

  return (
    <>
    {showMessage && (
      <Alert
        message="Payment Error"
        description={errorMessage}
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
