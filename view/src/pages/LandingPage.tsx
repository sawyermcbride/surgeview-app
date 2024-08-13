import React from 'react';
import { Layout, Menu, Button, Typography, Row, Col, Card } from 'antd';
import { HomeOutlined, InfoCircleOutlined, LoginOutlined } from '@ant-design/icons';
import {Link} from "react-router-dom";

const { Header, Footer, Content } = Layout;
const { Title, Paragraph } = Typography;

const LandingPage = () => {
  return (
    <Layout>
      <Header style={{ background: '#fff', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          {/*<Title level={3} style={{ margin: 0 }}>SurgeView</Title>*/}
          <img width="175px" alt="SurgeView Marketing" src="surge_view_new_cropped_transparent.png"/>
          <Menu theme="light" mode="horizontal">
            <Menu.Item key="1" icon={<HomeOutlined />}>Home</Menu.Item>
            <Menu.Item key="2" icon={<LoginOutlined />}><Link to="/login">Login</Link></Menu.Item>
          </Menu>
        </div>
      </Header>
      <Content style={{ textAlign: "center", padding: '0 50px', marginTop: '20px', maxWidth: "2000px" }}>
        <div style={{ textAlign: 'center' }}>
          <Title style={{marginTop:"100px"}}> Promote Your Videos With the #1 YouTube Growth Platform</Title>
          <Paragraph>
            The easiest way to boost your YouTube views and grow your audience with targeted ad campaigns.
          </Paragraph>
          <Button type="primary" style={{backgroundColor: "#c0392b"}} size="large"><Link to="/signup">Get Started</Link></Button>
        </div>
        <Row gutter={16} style={{ marginTop: '50px' }}>
          <Col md={8} sm={24} xs={24} style={{padding: "10px"}}>
            <Card title="Feature 1" bordered={false}>
              <Paragraph>Detailed description of feature 1.</Paragraph>
            </Card>
          </Col>
          <Col md={8} sm={24} xs={24} style={{padding: "10px"}}>
            <Card title="Feature 2" bordered={false}>
              <Paragraph>Detailed description of feature 2.</Paragraph>
            </Card>
          </Col>
          <Col md={8} sm={24} xs={24} style={{padding: "10px"}}>
            <Card title="Feature 3" bordered={false}>
              <Paragraph>Detailed description of feature 3.</Paragraph>
            </Card>
          </Col>
        </Row>
      </Content>
      <Footer style={{ textAlign: 'center', background: '#f0f2f5', padding: '20px' }}>
        <Paragraph>© 2024 SurgeView. All rights reserved.</Paragraph>
      </Footer>
    </Layout>
  );
};

export default LandingPage;