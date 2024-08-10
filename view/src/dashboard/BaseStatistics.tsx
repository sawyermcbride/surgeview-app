import React, { useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Progress,
  Card,
  Row,
  Col,
  Statistic,
  Spin,
  Flex,
  Alert,
} from "antd";
import { HomeOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const BaseStatistics = () => {
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <div style={{ textAlign: "center", padding: "40px", position: "relative" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "70%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "300px",
          }}
        >
          <Spin size="large" />
          <div style={{ marginTop: "20px" }}>
            <Alert
              message="Campaign Creation"
              description="Your campaign is being created. Please wait..."
              type="info"
              showIcon
            />
          </div>
        </div>
      )}
      {/* Form or other content goes here */}
    </div>
  );
};
export default BaseStatistics;
