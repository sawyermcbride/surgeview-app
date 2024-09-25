import React from 'react';
import { Layout, Menu, Button, Typography, Row, Col, Card, Steps,
 Image } from 'antd';
 
 
 import { HomeOutlined, InfoCircleOutlined, LoginOutlined } from '@ant-design/icons';
 import {Link} from "react-router-dom";
 import '../App.css';
 
 const {Step} = Steps;

const { Header, Footer, Content } = Layout;
const { Title, Paragraph } = Typography;

const LandingPage = () => {
  const steps = [
    {
      title: 'Step 1: Sign Up',
      description: 'Create your account and choose a plan.',
    },
    {
      title: 'Step 2: Explore Features',
      description: 'Discover the powerful tools and features we offer.',
    },
    {
      title: 'Step 3: Start Creating',
      description: 'Begin designing and building your projects.',
    },
    {
      title: 'Step 4: Share Your Work',
      description: 'Showcase your creations to the world.',
    },
  ]

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
      <Content className="custom-content">
        <div className="mobile-landing-header-text" style={{ textAlign: 'center', padding: '0px 25px' }}>
          <Title style={{marginTop:"80px"}}> Increase Viewer Engagement and Visibility with Effective YouTube Ad Solutions</Title>
          <Paragraph style={{fontSize: "19px"}}>
          Leverage a user-friendly platform designed to enhance viewer engagement and drive visibility for your YouTube content, all without the need for external agencies 
          </Paragraph>
          <Button type="primary" style={{backgroundColor: "#c0392b"}} size="large"><Link to="/signup">Get Started</Link></Button>
          <div style={{margin: "75px auto"}}>
            <img style={{maxWidth: "1200px", minWidth:"300px", width: "85%"}} src="surge_view_dashboard_cropped.png" alt="SurgeView Marketing Dashboard" />
          </div>
        </div>
        <Row justify="center" align="middle">
          <Col span={24} style={{ textAlign: 'center' }}>
            <Title level={2}>Discover Our Intuitive Platform</Title>
            <Paragraph style={{ fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
              Our platform simplifies the process of managing your YouTube campaigns, providing
              powerful tools to enhance viewer engagement and visibility. Experience seamless
              navigation and insightful analytics designed to help you maximize your content's
              impact.
            </Paragraph>
            <Image
              src="your-screenshot-url.png" // Replace with your screenshot URL
              alt="Application Screenshot"
              preview={false}
              style={{ maxWidth: '80%', height: 'auto', marginBottom: '20px' }}
            />
          </Col>
        </Row>
        <Row align="middle" justify="center">
        <Col xs={24} md={12} style={{ textAlign: 'center', padding: '10px' }}>
          <Image
            src="your-image-url.png" // Replace with your image URL
            alt="Descriptive Image"
            preview={false}
            style={{ width: '100%', height: 'auto' }}
          />
        </Col>
        <Col xs={24} md={12} style={{ padding: '10px' }}>
          <Title level={2}>Empower Your YouTube Journey</Title>
          <Paragraph style={{ fontSize: '16px' }}>
            Our platform provides the tools you need to increase engagement and visibility
            for your YouTube content. Simplify your workflow and focus on what matters:
            connecting with your audience and growing your channel.
          </Paragraph>
        </Col>
      </Row>
      </Content>
      <Footer style={{ textAlign: 'center', background: '#f0f2f5', padding: '20px' }}>
        <Paragraph>© 2024 SurgeView Marketing. All rights reserved.</Paragraph>
      </Footer>
    </Layout>
  );
};

export default LandingPage;