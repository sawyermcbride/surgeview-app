import React, { useEffect, useState, useContext } from "react";
import { Layout, Button, Typography, Form, Input, Col, Row, Card, List, Spin, Alert } from "antd";


import VideoLinkPage from "../components/signup/VideoLinkPage";
import SelectPlan from "../components/signup/SelectPlan";
import PaymentPage from "../components/signup/PaymentPage";

import { redirect, useNavigate } from "react-router";
import api from "../utils/apiClient";

import { SignupContext, SignupProvider } from "../contexts/SignupContext";

const { Header, Footer, Content } = Layout;
const { Title, Text } = Typography;



const GetStarted: React.FC = () => {
  const [contentColumnWidth, setContentColumnWidth] = useState("75%");

  
  const {signupData, updateSignupData, resetSignupData} = useContext(SignupContext);

  const navigate = useNavigate();

  useEffect(() => {
    // console.log(signupData);
    // console.log("New signup step");

    const checkStepAndLoadSecret = async () => {
      const token = localStorage.getItem("token");
      
      if(!token) {
        resetSignupData();     

        navigate('/signup');
      }

      const lastStepCompleted = localStorage.getItem("lastStepCompleted");
      const lastStep = lastStepCompleted ? parseInt(lastStepCompleted) : 0;
      let newStep;
      if (lastStepCompleted && lastStep > 0 && lastStep < 3) {
        newStep = lastStep + 1;
        if(newStep != signupData.step) {
          updateSignupData({
            step: newStep
          }); 
        }
        
      } else if(lastStep > 3) {
        navigate('/dashboard');
      }
      
    };

    checkStepAndLoadSecret();
  },[signupData]);





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

  const getMainContent = () => {
    return (
      <>
        <div style={{display: signupData.step === 1 ? 'block' : 'none'}}>
          <VideoLinkPage/>
        </div>
        <div style={{display: signupData.step === 2 ? 'block' : 'none'}}>
          <SelectPlan/>
        </div>
        <div style={{display: signupData.step === 3 ? 'block' : 'none'}}>
          <PaymentPage/>
        </div>
      </>
    )
  };

  
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Header style={{ backgroundColor: 'transparent', textAlign: 'center', padding: '20px' }}>
        <img src="surge_view_new_cropped_transparent.png" alt="Logo" style={{ height: '60px', marginBottom: '20px' }} />
      </Header>
      <Content style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', paddingTop: '50px' }}>
        <div style={{ width: contentColumnWidth, minWidth: "350px", textAlign: 'center' }}>
          <Title level={3} style={{ color: '#333' }}>{getHeaderTitle(signupData.step)}</Title>
            {signupData.formLoading ? (<Spin size="large" style={{marginTop: "25px"}}/>) : (
              getMainContent()
            )}
        </div>
      </Content>
    </Layout>
  )
};
export default GetStarted;
