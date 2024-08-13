import React, {useState} from "react";

import { Card, Row, Col, Statistic} from "antd";
import { HomeOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";



const StatCard = () => {
    return (
        <Card
          style={{ 
            width: 300, 
            backgroundColor: "#27ae60", // Dark background
            color: '#fff', // White text color
            margin: "5px 10px"
            
          }}
          bordered={true}

        >
        <Statistic
          title="Campaign Status"
          value={1}
          suffix="Active"
          prefix={<SettingOutlined />}
        />
        </Card>
    )
}

export default StatCard;