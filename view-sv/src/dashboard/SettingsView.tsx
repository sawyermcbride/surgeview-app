import React from 'react';
import { Form, Input, Button, Typography, Divider } from 'antd';

const { Title } = Typography;

const SettingsView: React.FC = () => {
  const handleFinish = (values: any) => {
    console.log('Form values:', values);
    // Handle form submission logic here
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <Title level={2}>Update Your Account</Title>
      <Form onFinish={handleFinish} layout="vertical">
        <Form.Item
          label="Change Email"
          name="email"
          rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          label="Change Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your new password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Divider />

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Save Changes
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="default" style={{ width: '100%' }}>
            Cancel Plan(s)
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="default" style={{ width: '100%' }}>
            Update Billing
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="default" style={{ width: '100%' }}>
            Help
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="default" style={{ width: '100%' }}>
            Contact Support
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SettingsView;
