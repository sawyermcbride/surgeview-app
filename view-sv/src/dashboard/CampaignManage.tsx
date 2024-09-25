import React, {useState, useEffect, useContext} from "react";
import {Form, Input, Button, Typography, notification, Space, Select,
     Breadcrumb, RadioChangeEvent, Radio, Alert, Descriptions, Popconfirm, message, Modal, Spin,
     Badge} from "antd";
import api from "../utils/apiClient";
import { CampaignsContext } from "../contexts/CampaignsContext";
import ManagePlanSelect from "../components/dashboard/ManagePlanSelect";
import CampaignManageAlert from "../components/CampaignManageAlert";

const {Option} = Select;
const {Title, Link, Text} = Typography;


interface CampaignData {
    plan_name: string, 
    video_link: string,
    video_title: string, 
    channel_title: string,
    status: string
}

interface CampaignManageProps {
    data: CampaignData,
    loadCampaignData: () => Promise<void>,
}


const CampaignManage: React.FC<CampaignManageProps> = function( {data, loadCampaignData} ) {
    

    const {campaignsStateData, updateCampaignData} = useContext(CampaignsContext);
    const [form] = Form.useForm();
    const [planSelect, setPlanSelect] = useState<string>("");

    const [secondaryStatus, setSecondaryStatus] = useState<string>("");
    const [cancelClicked, setCancelClick] = useState(false); 
    const [restartClicked, setRestartClicked] = useState(false);
    
    
    const planOptions: Array<object> = [
        {label: 'Standard', value: 'Standard'},
        {label: 'Premium', value: 'Premium'},
        {label: 'Pro', value: 'Pro'},
    ]
    const pricing: { [key: string]: number} = {
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
            await api.put(`http://10.0.0.47:3001/campaign/update/${data.campaign_id}`, {
                video_link: values.updated_link ? values.updated_link : data.video_link,
                plan_name: values.plan_name
            }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            })
            
            
            setTimeout(async() => {
                await loadCampaignData();
                notification.success({
                    message: "Campaign Updated",
                    description:
                    "Your campaign has been updated. Any changes are now effective.",
                })
                updateCampaignData({loading:false});
                form.setFieldsValue({ plan_name: values.plan_name });
            }, 2500);
        
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
        if(value == data.plan_name) {
            setSecondaryStatus("");
        } else {
            setSecondaryStatus("show");
        }
        setPlanSelect(value);
    }


    return (
        <>
        {data ? (
        <div style={{width: "95%"}}>
            <CampaignManageAlert planSelect={planSelect} planSelectPricing={ pricing[planSelect]}
                handleModalCancel={handleModalCancel} handleModalOk={handleModalOk} cancelClicked={cancelClicked}
                restartClicked={restartClicked} status={data.status} secondaryStatus={secondaryStatus}
            />            
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
                    {label: "Plan", children: <Text>{data.plan_name} @ ${data.price} / Month</Text>},
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
                            <Button type="primary" htmlType="submit" >
                                Update
                            </Button>
                            <Button danger onClick={() => {handleUpdateStatusClick('cancel') }}
                              htmlType="button" >
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