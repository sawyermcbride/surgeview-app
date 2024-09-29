import React, {useContext, useEffect} from "react";
import { SignupContext } from "../../contexts/SignupContext";
import {Form, Alert, Button, Input, Typography} from "antd";
import api from "../../utils/apiClient";
import { AppMainContext } from "../../contexts/AppMainContext";

const {Text} = Typography;

interface FormValues {
    youtube_url: string;
}

const VideoLinkPage: React.FC = () => {
    const {signupData, updateSignupData, createSessionKey} = useContext(SignupContext);
  
    const appContext = useContext(AppMainContext);

    const onSubmit = async(values: FormValues) => {

        updateSignupData({
            contentColumnWidth: "75%",
            formLoading: true
        });
        try {
            const result = await api.post("http://10.0.0.47:3001/youtube/validate", {
                url: values.youtube_url
            });

            if(result.data.valid) {
                updateSignupData({
                    step: 2,
                    formLoading: false,
                    channelTitle: result.data.channelTitle,
                    videoTitle: result.data.title,
                    youtubeUrl: values.youtube_url,
                    lastStepCompleted: 1,
                    highestStepCompleted: 1,
                });
            }
        } catch {
            updateSignupData({
                videoLinkError: "Your chosen link is not a valid YouTube Video. Please check and try again.",
                formLoading: false
            });
        }
    }

    useEffect(() => {
      createSessionKey(false);

    }, [])
    return (
        <>
        { signupData.videoLinkError && 
            <Alert message={signupData.videoLinkError} showIcon type="error" style={{marginTop: "20px", marginBottom: '15px'}} />}
        <Text style={{fontSize: appContext?.state.isMobile ? '14px': '16px'}}>To get started, choose your video to include in the campaign. 
          On the next page you will be able to select a plan that determines the number of viewers you will reach.
        </Text>
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
              Continue
            </Button>
          </Form.Item>
        </Form>
        </>
    )
}

export default VideoLinkPage;