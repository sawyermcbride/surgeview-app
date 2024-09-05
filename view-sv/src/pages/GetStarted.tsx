import React, { useEffect, useState } from "react";
import { Layout, Button, Typography, Form, Input, Col, Row, Card, List, Spin, Alert } from "antd";
import { CreditCardOutlined, CalendarOutlined, SafetyOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';

import PaymentForm from "../components/PaymentForm";

import { useNavigate } from "react-router";
import api from "../utils/apiClient";

import { PaymentElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { sign } from "crypto";

const { Header, Footer, Content } = Layout;
const { Title, Text } = Typography;

const stripePromise = loadStripe("pk_test_51PmqG6KG6RDK9K4gUxR1E9XN8qvunE6UUfkM1Y5skfm48UnhrQ4SjHyUM4kAsa4kpJAfQjANu6L8ikSnx6qMu4fY00I6aJBlkG");


const GetStarted: React.FC = () => {
  const [signupStep, setSignupStep] = useState(1);
  const [formLoading, setFormLoading] = useState(false);
  const [contentColumnWidth, setContentColumnWidth] = useState("75%");
  const [videoLinkError, setVideoLinkError] = useState("");
  const [paymentPlanError, setPaymentPlanError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  
  const priceList = {Pro: 399, Premium: 199, Standard: 99};

  const fetchClientSecret = async(amount: number) => {

    try {
      const price = priceList[localStorage.getItem("pricing")];
      const campaignId = localStorage.getItem("campaignId");

      if(!price || !campaignId ) {
        setPaymentPlanError("Error");
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
        setPaymentPlanError("An Error Occured");
    }
  } 

  useEffect(() => {
    setFormLoading(true);
    const checkStepAndLoadSecret = async () => {
      const token = localStorage.getItem("token");
      if(!token) {
        localStorage.deleteItem('lastStepCompleted');
        localStorage.deleteItem('campaignId');        
        localStorage.deleteItem('pricing');        
        localStorage.deleteItem('youtubeUrl');        

        navigate('/signup');
      }

      const lastStepCompleted = localStorage.getItem("lastStepCompleted");
      const lastStep = lastStepCompleted ? parseInt(lastStepCompleted) : 0;
      let newStep;
      if (lastStepCompleted && lastStep > 0 && lastStep < 3) {
        newStep = lastStep + 1;
        if(newStep != signupStep) {
          setSignupStep(newStep); 
          console.log(`Current step = ${signupStep}`);
        }
        setFormLoading(false);
      }

      if(newStep === 3) {
        const result = await fetchClientSecret(99);
        setClientSecret(result);
      }
      
      setFormLoading(false);
    };

    checkStepAndLoadSecret();
  }, [signupStep]);



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
        return "1. Choose Video to Promote";
      case 2:
        return "2. Choose a Plan";
      case 3:
        return "3. Payment Information";
      default:
        return "Error";
    }
  };

  const pricingSubmit = (planName: string) => {
    setFormLoading(true);
    localStorage.setItem("pricing", planName);
    localStorage.setItem("lastStepCompleted", "2");
    setContentColumnWidth("75%");

    try {
      const video_link = localStorage.getItem("youtubeUrl");
      const pricing = localStorage.getItem("pricing");
      const token = localStorage.getItem("token");

      const data = {
        "videoLink": video_link, 
        "plan": pricing
      }

      
      api.post("http://10.0.0.47:3001/campaign/add", data, {
        
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        setFormLoading(false);
        localStorage.setItem("lastStepCompleted", "2");
        console.log("campaign added");
        localStorage.setItem("campaignId", res.data.campaignId);
        setSignupStep(prev => prev + 1);
        setPaymentPlanError("");
      })
      .catch(err => {
        console.error("Error in submitting campaign data");
        setPaymentPlanError("An error occured. Please try again.");
      })

    } catch(err) {
      setPaymentPlanError("An error occured. Please try again.");
    }



    setTimeout(() => {
      setFormLoading(false);
      setSignupStep(signupStep + 1);
    }, 1000)
  }

  const onSubmit = (values: any) => {
    /**
     * On submit is not called for pricing submit 
     * Step 1 is on startup when just the video link page is displaying
     * Step 2 is reached after the video link is submitted and the packages choice is displaying
     * Step 3 is the payment form and indicates the previous two are complete
     * The statement below for (signupStep < 3) is used for all pages untill signupStep is --
     *  incremented to 4 which means payment information is submitted 
     */

    if(signupStep < 3) {
      if(signupStep === 1) {
        setContentColumnWidth("75%");
        setFormLoading(true);
        api.post("http://10.0.0.47:3001/youtube/validate", {
          url: values.youtube_url
        }).then(res => {
          if(res.data.valid) {
            localStorage.setItem("youtubeUrl", values.youtube_url);
            localStorage.setItem("lastStepCompleted", "1");
            
            setTimeout(() => {
              setFormLoading(false);
              setSignupStep(signupStep + 1);
            }, 1000)
          }
        }).catch(error => {
          setVideoLinkError("Your provided link is not a valid video. Please check and try again.");
          setFormLoading(false);
        })

      } else {
        setContentColumnWidth("100%");
      }


    } else {
      setFormLoading(true);
      setContentColumnWidth("100%");
      setTimeout( () => {
        setFormLoading(false);
      },1000)
      
    }
  }

  const getMainContent = () => {
    // console.log("Loading getMainContent()");
    switch (signupStep) {
      case 1:
        return (
          <>
          {videoLinkError && 
          <Alert message={videoLinkError} showIcon type="error" style={{marginTop: "20px"}} /> }
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
              rules={[{ required: true, message: "Please enter your YouTube video URL" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item style={{marginTop: "40px"}}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          </>
        );
      case 2: 
      return (
        <>
        {paymentPlanError &&
        <Alert message={paymentPlanError} showIcon type="error" style={{marginTop: "20px"}} />  }

        <div style={{ padding: '50px 10px', background: '#f0f2f5' }}>
              <Row gutter={16} justify="center">
                {plans.map((plan) => (
                  <Col md={12} lg={8} sm={24}  xs={24} key={plan.title}>
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
        </>
      )
      case 3: 
        if(!clientSecret) {
          console.log(`Attempt to render without client secret`);
        } else {
          console.log(`Value of clientSecret = ${clientSecret}`);
          return (
            // <Elements stripe={stripePromise} options={{mode: "setup", currency: "usd"}}>
            <Elements stripe={stripePromise} options={{clientSecret}}>
                <div style={{marginTop: "10%"}}>
                  <PaymentForm onPaymentSuccess={onSubmit} clientSecret={clientSecret} />
                </div>
            </Elements>
          )
        }
    }
  };

  
  return (

    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Header style={{ backgroundColor: 'transparent', textAlign: 'center', padding: '20px' }}>
        <img src="surge_view_new_cropped_transparent.png" alt="Logo" style={{ height: '60px', marginBottom: '20px' }} />
      </Header>
      <Content style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', paddingTop: '50px' }}>
        <div style={{ width: contentColumnWidth, minWidth: "350px", textAlign: 'center' }}>
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
