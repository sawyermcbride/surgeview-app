import React, {useState, useEffect, useContext} from "react";
import {Form, Input, Button, Typography, notification, Space, Select,
     Breadcrumb, RadioChangeEvent, Radio, Alert, Descriptions, Popconfirm, message, Modal, Spin,
     Badge} from "antd";
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
    const [form] = Form.useForm();
    const [planSelect, setPlanSelect] = useState<string>("");

    const [cancelClicked, setCancelClick] = useState(false); 
    const [restartClicked, setRestartClicked] = useState(false);
    
    const planOptions: Array<object> = [
        {label: 'Standard', value: 'Standard'},
        {label: 'Premium', value: 'Premium'},
        {label: 'Pro', value: 'Pro'},
    ]
    const pricing = {
        'Standard': 99,
        'Premium': 199,
        'Pro': 399
    }

    const handleUpdateStatusClick = (operation: string) => {
        if(operation === 'cancel') {
            setCancelClick(true);
        } else {
            setRestartClicked(true);
        }

    }
    const handleModalOk = async () => {
      try {
        let result;
        if(cancelClicked) {
            result = await api.delete(`http://10.0.0.47:3001/campaign/delete/${data.campaign_id}`, {
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
        } else {
            result = await api.put(`http://10.0.0.47:3001/campaign/update/${data.campaign_id}`,{
                status: 'setup',
                plan_name: planSelect
            }, {
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
        }
        console.log(result);
    
        await loadCampaignData();
        notification.success({
            message: "Campaign Updated",
            description:
                "Your campaign has been updated. Any changes are now effective.",
        })

          setCancelClick(false);
          setRestartClicked(false);

      } catch(err) {
        notification.error({message: "Failed to update", description: "Please try again."});
      }
    }
    const handleModalCancel = () => {
        setCancelClick(false);
        setRestartClicked(false);
    }

    const onFinish = async (values: any) => {
        updateCampaignData({loading:true});
        const token = localStorage.getItem("token");
        try {
            const result = await api.put(`http://10.0.0.47:3001/campaign/update/${data.campaign_id}`, {
                video_link: values.updated_link ? values.updated_link : data.video_link,
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
        setPlanSelect(data?.plan_name || "");
        if(data) {
            form.setFieldsValue({ plan_name: data.plan_name });
        }
    }, [data]); // This will run every time `data` changes

    const onPlanChange = ({target: {value}}: RadioChangeEvent) => {
        setPlanSelect(value);
    }
    const onPlanSelect = function(name: string) {

    }

    return (
        <>
        {data ? (

        <div style={{width: "95%"}}>
            {data.status === 'stopped' ? (
                <Alert 
                    message="Your campaign is not running. Click 'restart' below to start it again.                         "
                    type="warning"
                    showIcon
                    style={{ marginBottom: '16px' }}
                />
            ) : (
                <Alert 
                    message="Updates will apply immediately and be valid for the remainder of your current month. Updates will also apply for following months."
                    type="info"
                    showIcon
                    style={{ marginBottom: '16px' }}
                />
            )}
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

            <Modal
                title="Confirm Restart Campaign"
                open={restartClicked}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Yes, Start Campaign"
                cancelText="No"
            >
                <p>Are you sure you want to restart this campaign? You will be charged today for your selected plan: 
                     <b>{' '+planSelect}</b> which is <b>${pricing[planSelect]}.00</b> / month
                </p>
                <p>You can change the plan by clicking 'No' on this confirm box, selecting the plan below and then clicking 'Restart Campaign' again.</p>
                <p>You can expect to start seeing results within a few hours to one day.</p>
                {/* You can add more detailed text or even additional content here */}
            </Modal>
            <Title level={5}>Campaign Information</Title>
            <Descriptions column={1} bordered size="small" items={
                [
                    {label: "Status", children:
                     <Text style={{color: data.status == 'active' ? "#27ae60" : "#e67e22", fontWeight: "bold"}}>
                        {data.status == 'setup' ? 'In-': ''}
                        {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                    </Text>},
                    {label: "Video Link", children: <Link href={data.video_link} target="_blank">{data.video_link}</Link>},
                    {label: "Video Title", children: <Text>{data.video_title}</Text>},
                    {label: "Channel Name", children: <Text>{data.channel_title}</Text>},
                    {label: "Selected Plan", children: <Text>{data.plan_name} @ ${data.price} / Month</Text>},
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
                    { (data.status === 'active' || data.status === 'setup') ? (
                        <>
                            <Button type="primary" htmlType="submit">
                                Update
                            </Button>
                            <Button danger onClick={() => {handleUpdateStatusClick('cancel') }} htmlType="button" >
                                Cancel Campaign
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button disabled type="primary" htmlType="submit">
                                Update
                            </Button>
                            <Button style={{backgroundColor: "#27ae60", color: "#fff"}} onClick={() => {handleUpdateStatusClick('restart') }} htmlType="button" >
                                Restart Campaign
                            </Button>
                        </>
                    )}
                    </Space>
                </Form.Item>
            </Form>
            {/* <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                <ManagePlanSelect/>
            </div> */}
        </div>
        ) : (<Spin size="large"/>)}
        </>
    )

}

export default CampaignManage;