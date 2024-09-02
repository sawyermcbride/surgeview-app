import React, {useState, useEffect} from "react";
import {Form, Input, Button, Typography, notification, Space, Select,
     Breadcrumb, RadioChangeEvent, Radio, Alert, Descriptions} from "antd";
import api from "../utils/apiClient";

const {Option} = Select;
const {Title, Link, Text} = Typography;


interface CampaignData {
    plan_name: string, 
    video_link: string,
    video_title: string, 
    channel_title: string,
}

interface CampaignManageProps {
    data: CampaignData,
    setLoading: (arg: boolean) => void,
    loadCampaignData: () => Promise<void>,
}


const CampaignManage: React.FC<CampaignManageProps> = ( {data, setLoading, loadCampaignData} ) => {
    
    const [form] = Form.useForm();
    const [planSelect, setPlanSelect] = useState(data.plan_name);
    
    
    const planOptions: Array<object> = [
        {label: 'Standard', value: 'Standard'},
        {label: 'Premium', value: 'Premium'},
        {label: 'Pro', value: 'Pro'},
    ]


    const onFinish = async (values: any) => {

        console.log("Campaign managed submited");
        console.log(values);
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const result = await api.put(`http://10.0.0.47:3001/campaign/update/${data.campaign_id}`, {
                video_link: values.updated_link,
                plan_name: values.plan_name
            }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            })
        await loadCampaignData();
        
        console.log(data.plan_name);

        setLoading(false);
        notification.success({
            message: "Campaign Updated",
            description:
              "Your campaign has been updated. Any changes are now effective.",
        })

        } catch(err) {
            setLoading(false);
            console.log(err);
        }
    }

    const onPlanChange = ({target: {value}}: RadioChangeEvent) => {
        setPlanSelect(value);
    }

    return (
        <div>
            <Alert 
                message="Updates will apply immediately and be valid for the remainder of your current month. Updates will also apply for following months."
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
            />
            <Title level={5}>Campaign Information</Title>
            <Descriptions column={1} bordered size="small" items={
                [
                    {label: "Current Link", children: <Text>{data.video_link}</Text>},
                    {label: "Current Title", children: <Text>{data.video_title}</Text>},
                    {label: "Current Channel", children: <Text>{data.channel_title}</Text>},
                    {label: "Current Plan", children: <Text>{data.plan_name} @ ${data.price} / Month</Text>},
                ]
            }
            />
            <Form
            form={form}
            name="control-hooks"
            style={{ maxWidth: 1500, width: '100%', marginTop: '25px' }}
            onFinish={onFinish}
            initialValues={{plan_name: data.plan_name}}
            >
                <Form.Item name="updated_link" label="New Link" style={{maxWidth: "600px"}} rules={[{ required: false }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Select Plan" name="plan_name">
                    <Radio.Group
                        options={planOptions}
                        onChange={onPlanChange}
                        value={data.plan_name}
                        optionType="button"
                    />
                </Form.Item>
                <Form.Item>
                    <Space>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button htmlType="button" >
                        Reset
                    </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )

}

export default CampaignManage;