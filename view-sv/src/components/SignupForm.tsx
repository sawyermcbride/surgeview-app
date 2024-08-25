import React from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Card,
  notification,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import api from "../utils/apiClient";
import { useNavigate } from "react-router";
import {Link} from "react-router-dom";
import { useAuth } from "./AuthContext";

const { Title, Text } = Typography;

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const {login} = useAuth();

  const onFinish = async (values: any) => {
    try {
      const response = await api.post(
        "http://10.0.0.47:3001/signup",  // Replace with your API endpoint
        values,
      );

      const { token, refreshToken } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("email", values.email);

      console.log("Success:", response.data);
      navigate("/get-started");
      // Optionally, handle successful signup (e.g., redirect to login)
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      if (error.response?.status === 409) {
        notification.error({
          message: "Signup Failed",
          description:
            "A user with this email exists. Please login or use a different email.",
        });
      } 
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="signup"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "Invalid email!" },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>

      <Form.Item
        name="confirm"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Please confirm your password!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The two passwords that you entered do not match!"),
              );
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Confirm Password"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Sign Up
        </Button>
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <Text type="secondary">
            Already have an account? <Link to="/login">Log in</Link>
            {/* Or use the anchor tag if not using React Router */}
            {/* Already have an account? <a href="/login">Log in</a> */}
          </Text>
        </div>
      </Form.Item>
    </Form>
  );
};

export default SignupForm;
