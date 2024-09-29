import React, { useEffect, useContext } from "react";
import { Layout, Button, Typography, Spin, Space, 
  Tooltip} from "antd";


import VideoLinkPage from "../components/signup/VideoLinkPage";
import SelectPlan from "../components/signup/SelectPlan";
import PaymentPage from "../components/signup/PaymentPage";
import CustomFooter from "../components/CustomFooter";


import {useNavigate } from "react-router";


import { SignupContext } from "../contexts/SignupContext";
import { AppMainContext } from "../contexts/AppMainContext";


const { Header, Content } = Layout;
const { Title, Text } = Typography;


interface GetStartedProps {
  contentColumnWidth?: string;
}
const GetStarted: React.FC<GetStartedProps> = function() {


  const appContext = useContext(AppMainContext);
  
  
  const {signupData, updateSignupData, resetSignupData} = useContext(SignupContext);

  const navigate = useNavigate();

  useEffect(() => {
  
    const checkStepAndLoadSecret = async () => {
      const token = localStorage.getItem("token");
      
      if(!token) {
        resetSignupData();     

        navigate('/signup');
      }

      // updateSignupData({step: 1});

      const lastStepCompleted = Number(signupData.lastStepCompleted) || 0;

      let newStep;
      if (lastStepCompleted >= 0 && lastStepCompleted < 3) {

        newStep = lastStepCompleted + 1;        
        if(newStep != signupData.step) {
          updateSignupData({
            step: newStep
          }); 
        }
        
      } else if(lastStepCompleted > 3) {
        navigate('/dashboard');
      }
      
    };

    checkStepAndLoadSecret();
  },[signupData]);

  const handleExitClick = () => {
    resetSignupData();
    navigate('/dashboard');
  }

  const handleBackClick = () => { 
   updateSignupData({
    lastStepCompleted: signupData.step - 2,
    isUpdating: true
   }); 
  }

  const getHeaderTitle = (num: number) => {
    switch (num) {
      case 1:
        return "1. Select a Video to Promote";
      case 2:
        return "2. Choose a Plan";
      case 3:
        return "3. Payment Information";
      default:
        return "Error";
    }
  };

  const getMainContent = () => {
    console.log('getMainContent:', signupData.step);
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

      <Header style={{ backgroundColor: 'transparent', padding: '20px', marginTop: '45px', display: 'flex',
        justifyContent: 'center', alignItems: 'center'
      }}>
          {appContext?.state.isMobile ? (
            <>
              <div style={{position: 'absolute', left: '10%', top: '-1%'}}>
                <Button onClick={handleExitClick}>Exit</Button>
                {signupData.step !== 1 && (
                  <Button onClick={handleBackClick}>Back</Button>
                )}
              </div>
            </>
          ) : 
          (
            <>
              <div style={{position: 'absolute', left: '10%'}}>
                <Button onClick={handleExitClick}>Exit to Dashboard</Button>
                {signupData.step !== 1 && (
                  <Button style={{marginLeft: '25px'}} onClick={handleBackClick}>Back</Button>
                )}
              </div>
            </>
          )}
            
          


          <div style={{height: '60px'}}>
            <img src="surge_view_new_cropped_transparent.png" alt="Logo" style={{ height: '100%', marginBottom: '0px' }} />
          </div>
          
      </Header>
      <Content style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', paddingTop: '30px' }}>
        <div style={{ width: "75%", minWidth: "350px", textAlign: 'center' }}>
          {(signupData.step !== 1) && (
            <Tooltip title="You can edit your video or plan by clicking 'Back' at the top left">
              <Space  direction="vertical" style={{ cursor: 'pointer', width: '100%', marginBottom: '5px' }}>
                <Text>Video:&nbsp;
                  <Text strong>  {signupData.videoTitle} </Text> 
                </Text>
                <Text>Channel:&nbsp;
                    <Text strong>{signupData.channelTitle}</Text>
                </Text>
                {signupData.step === 3 && (
                  <Text>Plan:&nbsp;
                    <Text strong>{signupData.pricing}</Text>
                  </Text>
                )}
              </Space>
            </Tooltip>
          )}
          <Title level={3} style={{ color: '#333' }}>{getHeaderTitle(signupData.step)}</Title>
            {signupData.formLoading ? (<Spin size="large" style={{marginTop: "25px"}}/>) : (
              getMainContent()
            )}
        </div>
      </Content>
      <div>
          <CustomFooter/>
      </div>
    </Layout>
  )
};
export default GetStarted;
