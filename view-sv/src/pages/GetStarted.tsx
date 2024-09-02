import React, { useEffect, useState } from "react";
import { Layout, Button, Typography, Form, Input, Col, Row, Card, List, Spin } from "antd";
import { CreditCardOutlined, CalendarOutlined, SafetyOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';

import PaymentForm from "../components/PaymentForm";

import { useNavigate } from "react-router";
import api from "../utils/apiClient";

const { Header, Footer, Content } = Layout;
const { Title, Text } = Typography;



const GetStarted: React.FC = () => {
  const [signupStep, setSignupStep] = useState(1);
  const [formLoading, setFormLoading] = useState(false);
  const [contentColumnWidth, setContentColumnWidth] = useState("50%");
  
  useEffect( () => {
    const lastStepCompleted = localStorage.getItem("lastStepCompleted");

    if(lastStepCompleted && parseInt(lastStepCompleted) > 0 && parseInt(lastStepCompleted) < 3) {
      setSignupStep(parseInt(lastStepCompleted) + 1);
    }
  }, [])



  const navigate = useNavigate();


  const plans = [
    {
      title: "Basic",
      price: "$99 / month",
      features: ["3,750 to 5,000 Average Monthly Views","5% to 10% of Viewers, on Average Become Subscribers", "100% Safe Strategy Using Official YouTube Ads Platform", "View Campaign Statistics in Dashboard", 
        "24/7 Email Support from US Based Team"
      ],
      buttonText: "Start 7 Day Free Trial",
    },
    {
      title: "Standard",
      price: "$199 / month",
      features: ["7,500 to 10,000 Average Monthly Views","5% to 10% of Viewers, on Average Become Subscribers", "100% Safe Strategy Using Official YouTube Ads Platform", "View Campaign Statistics in Dashboard", 
        "24/7 Email Support from US Based Team"
      ],
      buttonText: "Start 7 Day Free Trial",
    },
    {
      title: "Pro",
      price: "$399 / month",
      features: ["16,000 to 20,000 Average Monthly Views","5% to 10% of Viewers, on Average Become Subscribers", "100% Safe Strategy Using Official YouTube Ads Platform", "View Campaign Statistics in Dashboard", 
        "24/7 Email Support from US Based Team"
      ],
      buttonText: "Start 7 Day Free Trial",
    },
  ];

  const getHeaderTitle = (num: Number) => {
    switch (num) {
      case 1:
        return "1. Select the Video to Recieve Views in Your Campaign";
      case 2:
        return "2. Select a Plan";
      case 3:
        return "3. Add Your Card Details";
      default:
        return "Error";
    }
  };

  const pricingSubmit = (planName: string) => {
    setFormLoading(true);
    localStorage.setItem("pricing", planName);
    localStorage.setItem("lastStepCompleted", "2");
    setContentColumnWidth("50%");

    setTimeout(() => {
      setFormLoading(false);
      setSignupStep(signupStep + 1);

    }, 1000)
  }

  const onSubmit = (values: any) => {
    if(signupStep < 3) {
      if(signupStep === 0) {
        setContentColumnWidth("75%");
      } else {
        setContentColumnWidth("50%");
      }
      localStorage.setItem("youtubeUrl", values.youtube_url);
      localStorage.setItem("lastStepCompleted", "1");
      setFormLoading(true);

      setTimeout(() => {
        setFormLoading(false);
        setSignupStep(signupStep + 1);
      }, 1000)

    } else {
      setFormLoading(true);
      setTimeout(() => {
        console.log("ready to create campaign")

        try {
          const video_link = localStorage.getItem("youtubeUrl");
          const pricing = localStorage.getItem("pricing");
          const token = localStorage.getItem("token");

          const data = {
            "videoLink": video_link, 
            "plan": pricing
          }

          console.log("Token");
          console.log(token);
          localStorage.setItem("lastStepCompleted", "3");

          api.post("http://10.0.0.47:3001/campaign/add", data, {

            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(res => {
            setFormLoading(false);
            navigate("/dashboard");
  
          })
          .catch(err => {
            console.error("Error in submitting campaign data");
          })

        } catch(err) {
          console.error("Problem reading saved data");
        }
      }, 1500)
    }
  }

  const getMainContent = () => {
    switch (signupStep) {
      case 1:
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
      case 2: 
      return (
        <div style={{ padding: '50px 10px', background: '#f0f2f5' }}>
              <Row gutter={16} justify="center">
                {plans.map((plan) => (
                  <Col md={8} lg={8} sm={24}  xs={24} key={plan.title}>
                    <Card
                      title={plan.title}
                      bordered={false}
                      style={{ textAlign: 'center', marginBottom: '20px' }}
                    >
                      <h2>{plan.price}</h2>
                      <h3 style={{color: "#3498db"}} >7 Days Free</h3>
                      <ul>
                        {plan.features.map((feature, index) => (
                          <li style={{padding: "10px 0px"}}key={index}>{feature}</li>
                        ))}
                      </ul>
                      <Button type="primary" onClick={ () => {pricingSubmit(plan.title)} } style={{ marginTop: '20px' }}>
                        {plan.buttonText}
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
          </div>
      )
      case 3: 
        return (
          <PaymentForm onPaymentSuccess={onSubmit}/>
        )
    }
  };

  
  return (

    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Header style={{ backgroundColor: 'transparent', textAlign: 'center', padding: '20px' }}>
        <img src="surge_view_new_cropped_transparent.png" alt="Logo" style={{ height: '60px', marginBottom: '20px' }} />
      </Header>
      <Content style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', paddingTop: '50px' }}>
        <div style={{ width: contentColumnWidth, minWidth: "350px", maxWidth: "1200px", textAlign: 'center' }}>
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
