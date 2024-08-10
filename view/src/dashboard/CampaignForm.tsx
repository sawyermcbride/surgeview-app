// CampaignForm.tsx
import React, { Dispatch, SetStateAction } from "react";
import { Form, Input, Button, Select } from "antd";
import axios from "axios";

const { Option } = Select;

interface CampaignFormProps {
  setDashboardView: Dispatch<SetStateAction<number>>;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ setDashboardView }) => {
  const token = localStorage.getItem("token");
  console.log(`token: ${token}`);
  const onFinish = async (values: any) => {
    try {
      const response = await axios.post(
        "https://c304dd4f-9bd6-4c65-acc2-d9c0935d9e52-00-3pwa21tc6kufh.janeway.replit.dev/campaign/add",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setDashboardView(2);
    } catch (err) {
      console.error("Error making request: ", err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flext-start",
        paddingTop: "50px",
        height: "100%",
      }}
    >
      <Form
        name="campaign"
        layout="vertical"
        style={{ width: "300px" }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Video Link"
          name="videoLink"
          rules={[{ required: true, message: "Please input the video link!" }]}
        >
          <Input placeholder="Enter Video Link" />
        </Form.Item>

        <Form.Item
          label="Plan"
          name="plan"
          rules={[{ required: true, message: "Please select a plan!" }]}
        >
          <Select placeholder="Select a Plan">
            <Option value="basic">
              Basic - $99 a month after 7 Day Free Trial
            </Option>
            <Option value="premium">
              Premium $199 a month after 7 Day Free Trial
            </Option>
            <Option value="pro">
              Pro - $399 a month after 7 day Free Trial
            </Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Start Campaign
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CampaignForm;
