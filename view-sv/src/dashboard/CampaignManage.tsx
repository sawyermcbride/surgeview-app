import React, {useState, useEffect} from "react";
import {Form, Input, Button, Typography, notification, Space, Select,
     Breadcrumb, RadioChangeEvent, Radio} from "antd";
import api from "../utils/apiClient";

const {Option} = Select;
const {Title, Link, Text} = Typography;


interface CampaignData {
    plan_name: string, 
    video_link: string,
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
            <Title level={5}>
                Current link: 
                <Text code>
                {data.video_link}
                </Text>
            </Title>
            <Form
            form={form}
            name="control-hooks"
            style={{ maxWidth: 1500, width: 700, marginTop: '25px' }}
            onFinish={onFinish}
            initialValues={{plan_name: data.plan_name}}
            >
                <Form.Item name="updated_link" label="New Link" rules={[{ required: false }]}>
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