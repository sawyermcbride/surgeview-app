import React, {useState, useContext} from "react";
import { SignupContext } from "../../contexts/SignupContext";
import {Alert, Button, Row, Col, Card, Typography} from "antd";
import api from "../../utils/apiClient";
import { AppMainContext } from "../../contexts/AppMainContext";


const {Text} = Typography;

const plans = [
    {
      title: "Standard",
      subTitle: 'Get started reaching a new audience on YouTube',
      price: "$99 / month",
      features: ["Estimated 3,750 to 5,000 Monthly Views","75% Spent Directly on Ads, 25% Management Fee", "Administered Through Official Google Ads Platform", "Advanced Dashboard for Tracking",
        "Easily Cancel or Manage Your Campaigns Online"
      ],
      buttonText: "Select",
    },
    {
      title: "Premium",
      price: "$199 / month",
      subTitle: 'Reach a larger audience with more views',
      features: ["Estimated 7,500 to 10,000 Average Monthly Views","80% Spent Directly on Ads, 20% Management Fee", "Administered Through Official Google Ads Platform", "Advanced Dashboard for Tracking",
        "Easily Cancel or Manage Your Campaigns Online"
      ],
      buttonText: "Select",
    },
    {
      title: "Pro",
      price: "$399 / month",
      subTitle: 'Maximum reach for fast growth',
      features: ["Estimated 16,000 to 20,000 Average Monthly Views","81% Spent Directly on Ads, 19% Management Fee", "Administered Through Official Google Ads Platform", "Advanced Dashboard for Tracking", 
        "Easily Cancel or Manage Your Campaigns Online"
      ],
      buttonText: "Select",
    },
];

const SelectPlan: React.FC = () => {
    const {updateSignupData, signupData} = useContext(SignupContext);
    const [paymentPlanError, setPaymentPlanError] = useState("");

    let isSubmitting = false;
    
    const appContext = useContext(AppMainContext);

    const onSubmit = async function(planName: string) {

      if(isSubmitting) {
        return;
      }

      isSubmitting = true;

      updateSignupData({
          contentColumnWidth: "75%",
          formLoading: true
      });

        
      try {

          const token = localStorage.getItem("token");
          const sessionKey = localStorage.getItem("sessionKey");

          const data = {
            "videoLink": signupData.youtubeUrl, 
            "plan": planName
          }

          let response;
          if(signupData.isUpdating && signupData.campaignId
            && signupData.pricing && signupData.youtubeUrl) {
            
            response = await api.put(`http://10.0.0.47:3001/campaign/update/${signupData.campaignId}`, {
              video_link: signupData.youtubeUrl,
              plan_name: planName
            }, {
              headers: {
                  Authorization: `Bearer ${token}`,
                  SessionKey: sessionKey
              }
            });

          } else {
            console.log('Calling post to add campaign');
            response = await api.post("http://10.0.0.47:3001/campaign/add", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    SessionKey: sessionKey
                }
            });

            console.log('Response from add campaign', response);
            /**
             * Only update the campaign id if it's a new campaign, as the response does not return the 
             * id for an udpate 
             */
          }
          
          
          let updateCampaignId;
          
          if(response.data.campaignId) {
            updateCampaignId = response.data.campaignId;
          }
          
          updateSignupData({
            step: 3,
            lastStepCompleted: 2,
            pricing: planName,
            highestStepCompleted: 2,
            isUpdating: false,
            campaignId: updateCampaignId !== undefined ? updateCampaignId : signupData.campaignId,
            formLoading: false
          });
          
          console.log('Updating signup data');
          setPaymentPlanError("");
        } catch(err) {

          console.error("Error in submitting campaign data", err);
          setPaymentPlanError("An error occurred. Please try again.");
          updateSignupData({
              formLoading: true,
          });
        }

    }
    return (
        <>
        {paymentPlanError &&
        <Alert message={paymentPlanError} showIcon type="error" style={{marginTop: "20px"}} />  }
        <Text style={{fontSize: appContext?.state.isMobile ? '14px': '16px'}}>Each plan provides a different level of reach, with a higher cost allowing you to reach more viewers.
          Your budget is allocated through a Cost Per View (CPV) model, where it is only spent for each view you receive. 
          You are gauranteed certain number of views each month. Choose the plan that best aligns with your goals on YouTube.
        </Text>
        <div style={{ padding: '15px 10px', marginTop: '35px' ,background: '#f0f2f5' }}>
              <Row gutter={16} justify="center">
              {plans.map((plan) => (
                  <Col style={{marginBottom: '25px'}} md={24} lg={12} sm={24}  xs={24} xl={12} xxl={8} key={plan.title}>
                  <Card
                      title={plan.title}
                      bordered={false}
                      style={{ textAlign: 'center', marginBottom: '20px' }}
                      onClick={() => onSubmit(plan.title)}
                  >
                      <h2>{plan.price}</h2>
                      <h3 style={{color: "#3498db"}} >{plan.subTitle}</h3>
                      <ul>
                      {plan.features.map((feature, index) => (
                          <li style={{padding: "10px 0px"}}key={index}>{feature}</li>
                      ))}
                      </ul>
                      <Button type="primary" size={"large"} onClick={ (e) => {e.preventDefault(); onSubmit(plan.title)} } style={{ marginTop: '20px' }}>
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