import React from 'react';
import {Collapse, Row, Col, Typography, Card} from 'antd';

const {Text} = Typography;

const PaymentQuestions: React.FC = function() {
  const faqs = [
    {
      question: "What can I expect when using the SurgeViews platform?",
      answer: "You can expect a reliable service that drives viewers to your YouTube channel."
    },
    {
      question: "How do I manage my campaigns?",
      answer: "Our platform is built on an a comprehensive technology interface."
    },
    {
      question: "When will I be charged?",
      answer: "Yes, Ant Design provides theming capabilities to customize styles according to your needs."
    },
    {
      question: "Where do the video views come from?",
      answer: "Yes, Ant Design is built specifically for React applications."
    },
  ];

  return (
    <div style={{ maxWidth: '1500px', width: '100%', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Frequently Asked Questions</h2>
      <Row gutter={[16, 16]} style={{marginTop: '35px'}}>
        {faqs.map((faq, index) => (
          <Col sm={24} lg={12} key={index}>
            <Card title={faq.question}>
              {faq.answer}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )

}

export default PaymentQuestions;