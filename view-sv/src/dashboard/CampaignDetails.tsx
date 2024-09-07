import React, {useState, useEffect, useContext} from "react";
import {Form, Typography, notification, Space, Select,
     Breadcrumb, Alert, Col, Row} from "antd";
import api from "../utils/apiClient";
import StatCard from "../components/StatCard";

import { CampaignsContext } from "../contexts/CampaignsContext";


interface CampaignDetailsProps {
    campaignStatistics: Array<object>
}
const CampaignDetails: React.FC<CampaignDetailsProps> = ({campaignStatistics}) => {

    const {campaignsStateData, updateCampaignData} = useContext(CampaignsContext);
    const [lastSevenDaysViews, setLastSevenDaysViews] = useState(0);
    const [lastSevenDaysSubs, setLastSevenDaysSubs] = useState(0);

    useEffect( () => {
        console.log("New campaign statistics data, individual campaign: ");
        console.log( campaignStatistics);
        const totalViewsLastSevenDays = campaignStatistics?.reduce((acc, elem) => acc + elem.views, 0);
        const totalSubsLastSevenDays = campaignStatistics?.reduce((acc, elem) => acc + elem.subscribers, 0);
        
        setLastSevenDaysViews(totalViewsLastSevenDays);
        setLastSevenDaysSubs(totalSubsLastSevenDays);

    }, [campaignStatistics])

    return(
        <div style={{width: "100%"}}>
            <div style={{width: '100%', display: 'inline-block'}}>
                <Alert 
                    message="View the results of your campaign here. Their may be a one day delay."
                    type="success"
                    showIcon
                    style={{ margin: '0 auto', marginBottom: '16px', maxWidth: '1000px' }}
                />
            </div>
            <div style={{margin:"0px 10px"}}>
                <Row gutter={[24,24]}>
                    <Col style={{ border: "0px solid red" }} xxl={6} xl={8} lg={12} md={12} sm={24}>
                        <StatCard textColor="white" color="blue" icon="up_arrow" text="Yesterday" data={campaignStatistics?.[0]?.views || 0 }
                         suffix="Views"/>
                    </Col>
                    <Col style={{ border: "0px solid red" }} xxl={6} xl={8} lg={12} md={12} sm={24}>
                        <StatCard textColor="white" color="blue" icon="up_arrow" text="Yesterday" data={campaignStatistics?.[0]?.subscribers || 0} suffix="Subscribers"/>
                    </Col>
                    <Col style={{ border: "0px solid red" }} xxl={6} xl={8} lg={12} md={12} sm={24}>
                        <StatCard textColor="white" color="blue" icon="up_arrow" text="Last 7 Days" data={lastSevenDaysViews} suffix="Views"/>
                    </Col>
                    <Col style={{ border: "0px solid red" }} xxl={6} xl={8} lg={12} md={12} sm={24}>
                        <StatCard textColor="white" color="blue" icon="up_arrow" text="Last 7 Days" data={lastSevenDaysSubs} suffix="Subscribers"/>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default CampaignDetails;