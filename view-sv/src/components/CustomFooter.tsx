import React from "react";
import {Layout, Row, Col, Space,
   Typography} from "antd";


const {Footer} = Layout;
const {Text} = Typography;

const CustomFooter: React.FC = function() {
  return (
    <Footer style={{ backgroundColor: '#F9F9F9', padding: '20px 20px' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Text strong style={{ textAlign: 'center', fontSize: '18px' }}>
            SurgeView Marketing
          </Text>
          <Space style={{ marginLeft: '15px' }}>
            <Text>© {new Date().getFullYear()} All Rights Reserved.</Text>
          </Space>
        </Col>
        <Col>
          <Text style={{fontWeight: 'bold'}}>support@surgeviewmarketing.com</Text>
        </Col>
      </Row>
    </Footer>
  )
}

export default CustomFooter;