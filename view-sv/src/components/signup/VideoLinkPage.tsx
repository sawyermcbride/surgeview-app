import React, {useState, useContext, useRef, useEffect} from "react";
import { SignupContext } from "../../contexts/SignupContext";
import {Form, Alert, Button, Input} from "antd";
import api from "../../utils/apiClient";


const VideoLinkPage: React.FC = () => {
    const {signupData, updateSignupData, createSessionKey} = useContext(SignupContext);
    const [sessionKey, setSessionKey] = useState("");

    const onSubmit = async(values: any) => {

        updateSignupData({
            contentColumnWidth: "75%",
            formLoading: true
        });
        try {
            const result = await api.post("http://10.0.0.47:3001/youtube/validate", {
                url: values.youtube_url
            });

            if(result.data.valid) {
                localStorage.setItem("youtubeUrl", values.youtube_url);
                localStorage.setItem("lastStepCompleted", "1"); 
                updateSignupData({
                    step: 2,
                    formLoading: false,
                    channelTitle: result.data.channelTitle,
                    videoTitle: result.data.title
                });
            }
        } catch (error) {
            updateSignupData({
                videoLinkError: "Your chosen link is not a valid YouTube Video. Please check and try again.",
                formLoading: false
            });
        }
    }

    useEffect(() => {
      console.log("Video link use effect");
      const key = createSessionKey(false);
      setSessionKey(key);

    }, [])
    return (
        <>
        { signupData.videoLinkError && 
            <Alert message={signupData.videoLinkError} showIcon type="error" style={{marginTop: "20px"}} />}
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