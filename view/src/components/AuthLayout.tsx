// src/components/AuthLayout.tsx

import React from "react";
import { Layout, Row, Col } from "antd";

const { Content } = Layout;

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Content
        style={{
          width: 400,
          padding: 24,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <Row justify="center">
          <Col>
            <img
              src=""
              alt="SurgeView Marketing"
              style={{ width: 100, marginBottom: 24 }}
            />
          </Col>
        </Row>
        {children}
      </Content>
    </Layout>
  );
};

export default AuthLayout;
