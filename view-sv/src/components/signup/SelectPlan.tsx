import React, {useState, useContext, useEffect} from "react";
import { SignupContext } from "../../contexts/SignupContext";
import {Form, Alert, Button, Input, Row, Col, Card} from "antd";
import api from "../../utils/apiClient";

const plans = [
    {
      title: "Standard",
      price: "$99 / month",
      features: ["3,750 to 5,000 Average Monthly Views","5% to 10% of Viewers, on Average Become Subscribers", "100% Safe Strategy Using Official YouTube Ads Platform", "View Campaign Statistics in Dashboard", 
        "24/7 Email Support from US Based Team"
      ],
      buttonText: "Select",
    },
    {
      title: "Premium",
      price: "$199 / month",
      features: ["7,500 to 10,000 Average Monthly Views","5% to 10% of Viewers, on Average Become Subscribers", "100% Safe Strategy Using Official YouTube Ads Platform", "View Campaign Statistics in Dashboard", 
        "24/7 Email Support from US Based Team"
      ],
      buttonText: "Select",
    },
    {
      title: "Pro",
      price: "$399 / month",
      features: ["16,000 to 20,000 Average Monthly Views","5% to 10% of Viewers, on Average Become Subscribers", "100% Safe Strategy Using Official YouTube Ads Platform", "View Campaign Statistics in Dashboard", 
        "24/7 Email Support from US Based Team"
      ],
      buttonText: "Select",
    },
];

const SelectPlan: React.FC = () => {
    const {signupData, updateSignupData} = useContext(SignupContext);
    const [paymentPlanError, setPaymentPlanError] = useState("");

    const onSubmit = (planName: string) => {
        updateSignupData({
            contentColumnWidth: "75%",
            formLoading: true
        })

        
    try {
        const video_link = localStorage.getItem("youtubeUrl");
        const token = localStorage.getItem("token");
  
        const data = {
          "videoLink": video_link, 
          "plan": planName
        }
  
        
        api.post("http://10.0.0.47:3001/campaign/add", data, {
          
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
            updateSignupData({formLoading: true});
            localStorage.setItem("lastStepCompleted", "2");
            console.log("campaign added");
            localStorage.setItem("campaignId", res.data.campaignId);
            localStorage.setItem("pricing", planName);
            setPaymentPlanError("");
            updateSignupData({step: 3, formLoading: false});
        })
        .catch(err => {
          console.error("Error in submitting campaign data");
          setPaymentPlanError("An error occured. Please try again.");
        })
  
      } catch(err) {
        setPaymentPlanError("An error occured. Please try again.");
      }

        
    }
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
                      onClick={() => onSubmit(plan.title)}
                  >
                      <h2>{plan.price}</h2>
                      <h3 style={{color: "#3498db"}} >7 Days Free</h3>
                      <ul>
                      {plan.features.map((feature, index) => (
                          <li style={{padding: "10px 0px"}}key={index}>{feature}</li>
                      ))}
                      </ul>
                      <Button type="primary" size={"large"} onClick={ () => {onSubmit(plan.title)} } style={{ marginTop: '20px' }}>
                      {plan.buttonText}
                      </Button>
                  </Card>
                  </Col>
              ))}
              </Row>
          </div>
        </>
    )
}

export default SelectPlan;