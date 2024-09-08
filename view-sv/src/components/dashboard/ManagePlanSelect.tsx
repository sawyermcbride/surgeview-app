import React, {useState} from 'react';

import { Card, Row, Col } from 'antd';

const plans = [
  {
    title: 'Standard',
    price: '$29/month',
    features: ['Feature 1', 'Feature 2', 'Feature 3']
  },
  {
    title: 'Premium',
    price: '$49/month',
    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4']
  },
  {
    title: 'Pro',
    price: '$99/month',
    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5']
  }
];


const ManagePlanSelect: React.FC = function(props) {
  return (
    <Row gutter={16} justify="center">
    {plans.map((plan, index) => (
      <Col key={index} xs={24} sm={12} md={8}>
        <Card title={plan.title} bordered={false} style={{ border: "2px solid", borderColor: "#e74c3c", background: "#ecf0f1", textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{plan.price}</p>
          <ul>
            {plan.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </Card>
      </Col>
    ))}
  </Row>
  )
}

export default ManagePlanSelect;