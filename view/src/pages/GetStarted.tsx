import React, { useState } from "react";
import { Layout, Button, Typography, Form, Input } from "antd";

const { Header, Footer, Content } = Layout;
const { Title, Text } = Typography;

const SelectVideo: React.FC = () => {
  const [signupStep, setSignupStep] = useState(0);

  const getHeaderTitle = (num: Number) => {
    switch (num) {
      case 0:
        return "1. Select the Video to Recieve Views in Your Campaign";
      case 1:
        return "2. Select a Plan";
      case 2:
        return "Add Your Card Details";
      default:
        return "Error";
    }
  };

  const getMainContent = () => {
    switch (signupStep) {
      case 0:
        return (
          <Form
            name="layout-multiple-horizontal"
            layout="horizontal"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 15 }}
          >
            <Form.Item
              label="YouTube URL"
              name="Enter your video URL"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Form>
        );
    }
  };

  const saveData = (obj: Object) => {};
  return (
    <Layout>
      <Header>
        <Title>{getHeaderTitle(signupStep)}</Title>
      </Header>
      <Content></Content>
      <Footer></Footer>
    </Layout>
  );
};
export default SelectVideo;
