import React, {useState, useEffect} from "react";
import {Form, Typography, notification, Space, Select,
     Breadcrumb, Alert, Col, Row} from "antd";
import api from "../utils/apiClient";
import StatCard from "../components/StatCard";

const {Option} = Select;
const {Title, Link, Text} = Typography;

interface CampaignDetailsProps {
    setLoading: (arg: boolean) => void,
    campaignStatistics: object
}
const CampaignDetails: React.FC<CampaignDetailsProps> = ({setLoading, campaignStatistics}) => {
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
                    <Col style={{ border: "0px solid red" }} xxl={8} xl={8} lg={12} md={12} sm={24}>
                        <StatCard textColor="white" color="blue" icon="bar_chart" text="Yesterday" data={15} suffix="Views"/>
                    </Col>
                    <Col style={{ border: "0px solid red" }} xxl={8} xl={8} lg={12} md={12} sm={24}>
                        <StatCard textColor="white" color="blue" icon="bar_chart" text="Yesterday" data={4} suffix="New Subscribers"/>
                    </Col>
                    <Col style={{ border: "0px solid red" }} xxl={8} xl={8} lg={12} md={12} sm={24}>
                        <StatCard textColor="white" color="blue" icon="bar_chart" text="Yesterday" data={4} suffix="New Subscribers"/>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default CampaignDetails;