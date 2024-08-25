// src/components/Auth/LoginForm.tsx

import React from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import {Link} from "react-router-dom";

import { useAuth } from "./AuthContext";
import api from "../utils/apiClient";


const { Title, Text } = Typography;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const {login, } = useAuth();

  const onFinish = async (values: any) => {
    try {
      console.log("Submitting form");
      const response = await api.post(
        "http://10.0.0.47:3001/login",
        values,
      );
      const { token, refreshToken } = response.data;
      console.log(token);
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      
      
      await login();
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
        <Input prefix={<UserOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit"  block>
          Login
        </Button>
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <Text type="secondary">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </Text>
        </div>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
