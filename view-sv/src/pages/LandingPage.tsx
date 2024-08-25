import React from 'react';
import { Layout, Menu, Button, Typography, Row, Col, Card, Steps } from 'antd';
import { HomeOutlined, InfoCircleOutlined, LoginOutlined } from '@ant-design/icons';
import {Link} from "react-router-dom";
import '../App.css';

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
          <Title style={{marginTop:"80px"}}> Quickly Grow Your Videos with Real Views</Title>
          <Paragraph style={{fontSize: "19px"}}>
            Increase Your Channel's Reach using Our Paid Ads Strategy 
          </Paragraph>
          <Button type="primary" style={{backgroundColor: "#c0392b"}} size="large"><Link to="/signup">Get Started</Link></Button>
          <div style={{margin: "75px auto"}}>
            <img style={{maxWidth: "1200px", minWidth:"300px", width: "85%"}} src="surge_view_dashboard_cropped.png" alt="SurgeView Marketing Dashboard" />
          </div>
        </div>
        <div style={{margin: "auto", maxWidth: "1300px"}}>
          <Row gutter={16} style={{ marginTop: '50px' }}>
            <Col md={8} sm={24} xs={24} style={{padding: "10px"}}>
              <Card title="Start for $25 per week" bordered={false}>
                <Paragraph>No startup cost or contract. Start a one week campaign for just $25 and get approximately 1,000 real views from people who will like and commment on your video 
                  and subscribe to your channel. 
                </Paragraph>
              </Card>
            </Col>
            <Col md={8} sm={24} xs={24} style={{padding: "10px"}}>
              <Card title="YouTube Approved Strategy" bordered={false}>
                <Paragraph>We integrate directly with the official YouTube ads platform so your campaign takes advantage of their advanced targeting algorithms while ensuring
                  your channel stays 100% compliant and has zero risk of being penalized.
                </Paragraph>
              </Card>
            </Col>
            <Col md={8} sm={24} xs={24} style={{padding: "10px"}}>
              <Card title="Advanced Dashboard" bordered={false}>
                <Paragraph>Manage your video promotions and view detailed analytics in our dashboard.</Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
        <div>
        <Card title="How It Works">
          <Steps current={1}>
            {steps.map((item, index) => (
              <Steps.Step key={index} title={item.title} description={item.description} />
            ))}
          </Steps>
        </Card>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', background: '#f0f2f5', padding: '20px' }}>
        <Paragraph>© 2024 SurgeView Marketing. All rights reserved.</Paragraph>
      </Footer>
    </Layout>
  );
};

export default LandingPage;