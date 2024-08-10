// src/components/Auth/LoginForm.tsx

import React from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import axios from "axios";
import api from "../utils/api";
const { Title } = Typography;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const response = await axios.post(
        "https://c304dd4f-9bd6-4c65-acc2-d9c0935d9e52-00-3pwa21tc6kufh.janeway.replit.dev/login",
        values,
      );
      const { token } = response.data;

      localStorage.setItem("token", token);
      console.log("Navigating to /dashboard");
      navigate("/dashboard");
    } catch (err) {
      message.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <Form name="login" onFinish={onFinish} layout="vertical">
      <Title level={3} style={{ textAlign: "center" }}>
        Login
      </Title>
      <Form.Item
        name="email"
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
