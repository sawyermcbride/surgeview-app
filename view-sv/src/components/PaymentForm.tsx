import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Form, Input, Button, Row, Col, Typography } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";

const {Title, Paragraph} = Typography;

type PaymentFormProps = {
    onPaymentSuccess: (a: any) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({onPaymentSuccess}) => {
  const stripe = useStripe();
  const elements = useElements();



  const CARD_ELEMENT_OPTIONS = {
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
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)!,
      billing_details: {
        name: values.name,
        address: {
          postal_code: values.zipCode,
        },
      },
    });

    if (error) {
      console.error(error);
    } else {
      console.log("Payment Method Created:", paymentMethod);
      onPaymentSuccess("");
    }
  };

  return (
    <Row>
      <Col lg={12} sm={24}>
        <Form onFinish={onSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Cardholder Name"
            rules={[{ required: true, message: 'Please enter the cardholder name!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="John Doe" />
          </Form.Item>

          <Form.Item label="Card Information">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </Form.Item>

          <Form.Item
            name="zipCode"
            label="Zip Code"
            rules={[{ required: true, message: 'Please enter your zip code!' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="12345" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={!stripe || !elements}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col lg={12} sm={24}>
        <div style={{padding: "25px 50px" }}>
          <Title level={4}>Start Getting New Views Today</Title>
          <Paragraph>Compete signup to start marketing your video today. 
            Manage your campaign and view details within our software. You can cancel at anytime in your account. </Paragraph>
        </div>
      </Col>
    </Row>
  );
};

export default PaymentForm;
