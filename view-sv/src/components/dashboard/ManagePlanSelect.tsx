import React, {useState} from 'react';

import { Card, Row, Col, Button } from 'antd';

const plans = [
  {
    title: 'Standard',
    price: '$99 / month',
    features: ['100% Real Views', '3,000+ Views a Month']
  },
  {
    title: 'Premium',
    price: '$199 / month',
    features: ['100% Real Views', '7,000+ Views a Month', '2x Results of Standard']
  },
  {
    title: 'Pro',
    price: '$399 / month',
    features: ['100% Real Views', '12,000+ Views / Month', '4x Results of Standard']
  }
];


const ManagePlanSelect: React.FC = function(props) {
  return (
    <Row gutter={16} justify="center">
    {plans.map((plan, index) => (
      <Col key={index} xs={24} sm={12} md={8}>
        <Card title={plan.title} bordered={false} style={{
           minWidth: "250px", border: "0px solid", borderColor: "#e74c3c", background: "#fff", textAlign: 'center', height: "275px"}}>
            <div>
              <p style={{ fontSize: '18px', fontWeight: 'bold'}}>{plan.price}</p>
                {/* 
                {plan.features.map((feature, idx) => (
                  <p key={idx}>{feature}</p>
                ))} */}
              <ul>
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          <Button style={{position: "absolute", marginBottom: "0px", bottom: "20px", transform: 'translateX(-50%)'}}>
            Select
          </Button>
        </Card>
      </Col>
    ))}
  </Row>
  )
}

export default ManagePlanSelect;