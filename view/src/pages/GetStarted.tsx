import React, { useState } from "react";
import { Layout, Button, Typography, Form, Input, Col, Row, Radio, List, Spin } from "antd";
import { CreditCardOutlined, CalendarOutlined, SafetyOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router";
const { Header, Footer, Content } = Layout;
const { Title, Text } = Typography;

const GetStarted: React.FC = () => {
  const [signupStep, setSignupStep] = useState(0);
  const [formLoading, setFormLoading] = useState(false);

  const navigate = useNavigate();

  const form = Form.useForm();
  const getHeaderTitle = (num: Number) => {
    switch (num) {
      case 0:
        return "1. Select the Video to Recieve Views in Your Campaign";
      case 1:
        return "2. Select a Plan";
      case 2:
        return "3. Add Your Card Details";
      default:
        return "Error";
    }
  };

  const onSubmit = (values: any) => {
    if(signupStep < 2) {
      localStorage.setItem(signupStep.toString(), JSON.stringify(values));
      setFormLoading(true);

      setTimeout(() => {
        setFormLoading(false);
        setSignupStep(signupStep + 1);
      }, 1000)

    } else {
      setTimeout(() => {
        setFormLoading(false);
        console.log("ready to create campaign")
        navigate("/dashboard");
      }, 2500)
    }
  }

  const getMainContent = () => {
    switch (signupStep) {
      case 0:
        return (
          <Form
            name="layout-multiple-horizontal"
            layout="horizontal"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 15 }}
            onFinish={onSubmit}
            style={{marginTop: "50px"}}
          >
            <Form.Item
              label="YouTube URL"
              name="youtube_url"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item style={{marginTop: "25px"}}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        );
      case 1: 
      return (
        <Form onFinish={onSubmit} layout="vertical">
          <Form.Item name="pricing" label="Select a Plan" rules={[{ required: true, message: 'Please select a plan!' }]}>
            <Radio.Group style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ marginTop: '10px' }}>
                <Text strong>Basic Plan:</Text>

                  <List
                    bordered
                    dataSource={[
                      'Feature 1',
                      'Feature 2',
                      'Feature 3',
                    ]}
                    renderItem={item => <List.Item>{item}</List.Item>}
                    style={{ textAlign: 'left' }}
                  />
                </div>
                <Radio.Button value="basic">Select - 7 Day Free Trial</Radio.Button>
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ marginTop: '10px' }}>
                <Text strong>Standard Plan:</Text>

                  <List
                    bordered
                    dataSource={[
                      'Feature A',
                      'Feature B',
                      'Feature C',
                    ]}
                    renderItem={item => <List.Item>{item}</List.Item>}
                    style={{ textAlign: 'left' }}
                  />
                </div>
                <Radio.Button value="standard">Select - 7 Day Free Trial</Radio.Button>
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ marginTop: '10px' }}>
                <Text strong>Pro Plan:</Text>
                  <List
                    bordered
                    dataSource={[
                      'Feature X',
                      'Feature Y',
                      'Feature Z',
                    ]}
                    renderItem={item => <List.Item>{item}</List.Item>}
                    style={{ textAlign: 'left' }}
                  />
                </div>
                <Radio.Button value="pro">Select - 7 Day Free Trial</Radio.Button>
              </div>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Next
            </Button>
          </Form.Item>
        </Form>
      )
      case 2: 
        return (
          <Form onFinish={onSubmit} layout="vertical">
            <Form.Item
              name="name"
              label="Cardholder Name"
              rules={[{ required: true, message: 'Please enter the cardholder name!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="John Doe" />
            </Form.Item>

            <Form.Item
              name="cardNumber"
              label="Card Number"
              rules={[{ required: true, message: 'Please enter your card number!' }]}
            >
              <Input prefix={<CreditCardOutlined />} placeholder="1234 5678 9123 4567" />
            </Form.Item>

            <Form.Item
              name="expiryDate"
              label="Expiry Date"
              rules={[{ required: true, message: 'Please enter your card expiry date!' }]}
            >
              <Input
                prefix={<CalendarOutlined />}
                placeholder="MM/YY"
                maxLength={5}
              />
            </Form.Item>

            <Form.Item
              name="cvv"
              label="CVV"
              rules={[{ required: true, message: 'Please enter your CVV!' }]}
            >
              <Input
                prefix={<SafetyOutlined />}
                placeholder="123"
                maxLength={3}
                type="password"
              />
            </Form.Item>

            <Form.Item
              name="zipCode"
              label="Zip Code"
              rules={[{ required: true, message: 'Please enter your zip code!' }]}
            >
              <Input prefix={<MailOutlined />} placeholder="12345" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        )
    }
  };

  const saveData = (obj: Object) => {};
  return (

    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Header style={{ backgroundColor: 'transparent', textAlign: 'center', padding: '20px' }}>
        <img src="surge_view_new_cropped_transparent.png" alt="Logo" style={{ height: '60px', marginBottom: '20px' }} />
      </Header>
      <Content style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', paddingTop: '50px' }}>
        <div style={{ width: '50%', minWidth: "350px", textAlign: 'center' }}>
          <Title level={3} style={{ color: '#333' }}>{getHeaderTitle(signupStep)}</Title>
          {formLoading ? (<Spin size="large" style={{marginTop: "25px"}}/>) : (
            getMainContent()
          )}
        </div>
      </Content>
    </Layout>
  )
};
export default GetStarted;
