import React, {useState, useEffect, useContext} from "react";
import {Form, Input, Button, Typography, notification, Space, Select,
     Breadcrumb, RadioChangeEvent, Radio, Alert, Descriptions, Popconfirm, message, Modal} from "antd";
import api from "../utils/apiClient";
import { CampaignsContext } from "../contexts/CampaignsContext";
import ManagePlanSelect from "../components/dashboard/ManagePlanSelect";

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
    loadCampaignData: () => Promise<void>,
}


const CampaignManage: React.FC<CampaignManageProps> = function( {data, loadCampaignData} ) {
    const {campaignsStateData, updateCampaignData} = useContext(CampaignsContext);
    console.log(data);
    const [form] = Form.useForm();
    const [planSelect, setPlanSelect] = useState(data.plan_name);
    const [cancelClicked, setCancelClick] = useState(false); 
    
    const planOptions: Array<object> = [
        {label: 'Standard', value: 'Standard'},
        {label: 'Premium', value: 'Premium'},
        {label: 'Pro', value: 'Pro'},
    ]

    const handleCancelClick = () => {
        setCancelClick(true);
    }
    const handleModalOk = async () => {
      try {
        const result = await api.delete(`http://10.0.0.47:3001/campaign/delete/${data.campaign_id}`, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          })

          notification.success({
            message: "Campaign Updated",
            description:
              "Your campaign has been updated. Any changes are now effective.",
          })

          setCancelClick(false);

      } catch(err) {
        notification.error({message: "Failed to update", description: "Please try again."});
      }
    }
    const handleModalCancel = () => {
        setCancelClick(false);
    }

    const onFinish = async (values: any) => {
        updateCampaignData({loading:true});
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
            
            
        updateCampaignData({loading:false});
        notification.success({
            message: "Campaign Updated",
            description:
            "Your campaign has been updated. Any changes are now effective.",
        })
        
        } catch(err) {
            updateCampaignData({loading:false});

            
            notification.error({
                message: "Failed to Update",
                description: "Please check your link and try again."
            })

        }
    }
    useEffect(() => {

        form.setFieldsValue({ plan_name: data.plan_name });
    }, [data]); // This will run every time `data` changes

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
            <Modal
                title="Confirm Cancellation"
                open={cancelClicked}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Yes, Cancel"
                cancelText="No"
            >
                <p>Are you sure you want to cancel this campaign? You will not be charged again.</p>
                <p>Your campaign will continue to run until the end of your billing period.</p>
                {/* You can add more detailed text or even additional content here */}
            </Modal>
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
                        Update
                    </Button>
                    <Button danger onClick={handleCancelClick} htmlType="button" >
                        Cancel Campaign
                    </Button>
                    </Space>
                </Form.Item>
            </Form>
            {/* <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                <ManagePlanSelect/>
            </div> */}
        </div>
    )

}

export default CampaignManage;