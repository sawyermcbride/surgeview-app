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
    <div style={{display: "flex", justifyContent: "flex-start"}}>

    </div>
    
  );
};
export default BaseStatistics;
