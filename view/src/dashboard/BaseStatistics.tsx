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
      <Row>
        <Col lg={8} md={8} sm={12} xs={24}>
          <Card
            style={{ 
              width: 300, 
              backgroundColor: "#f1c40f", // Dark background
              color: '#fff', // White text color
              margin: "5px 10px"
            }}
            bordered={true}

          >
          <Statistic
            title="Campaign Status"
            value={1}
            suffix="in setup"
            prefix={<SettingOutlined />}
          />
          </Card>
        </Col>
        <Col lg={8} md={8} sm={12} xs={24}>
`          <Card
            style={{ 
              width: 300, 
              backgroundColor: "#27ae60", // Dark background
              color: '#fff', // White text color
              margin: "5px 10px"
              
            }}
            bordered={true}

          >
          <Statistic
            title="Campaign Status"
            value={1}
            suffix="Active"
            prefix={<SettingOutlined />}
          />
          </Card>`
        </Col>
        <Col lg={8} md={8} sm={12} xs={24}>
          <Card
            style={{ 
              width: 300, 
              backgroundColor: "#f1c40f", // Dark background
              color: '#fff', // White text color
              margin: "5px 10px"
            }}
            bordered={true}

          >
          <Statistic
            title="Campaign Status"
            value={1}
            suffix="in setup"
            prefix={<SettingOutlined />}
          />
          </Card>
        </Col>
      </Row>
    </div>
    
  );
};
export default BaseStatistics;
