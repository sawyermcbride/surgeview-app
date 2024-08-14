import React, {useState, ReactNode} from "react";

import { Card, Row, Col, Statistic} from "antd";
import { HomeOutlined, UserOutlined, SettingOutlined, BarChartOutlined } from "@ant-design/icons";


type Colors = {
  green: string;
  red: string;
  yellow: string;
  blue: string;
}

type Icons = {
  home: ReactNode,
  user: ReactNode,
  setting: ReactNode,
  bar_chart: ReactNode
}

interface StatCardProps {
  color: keyof Colors, 
  icon: keyof Icons, 
  text: string, 
  data: number,
  suffix: string
}


const StatCard: React.FC<StatCardProps> = (props) => {

  const colors: Colors = {
    green: "#27ae60",
    red: "#c0392b",
    yellow: "#f1c40f",
    blue: "#3498db"

  };

  const icons: Icons = {
    home: <HomeOutlined/>,
    user: <UserOutlined/>,
    setting: <SettingOutlined/>,
    bar_chart: <BarChartOutlined/>
  }
  

  return (
      <Card
        style={{ 
          width: 300, 
          backgroundColor: colors[props.color], // Dark background
          color: '#fff', // White text color
          margin: "5px 10px"
          
        }}
        bordered={true}

      >
      <Statistic
        title= {props.text}
        value={props.data}
        suffix={props.suffix}
        prefix={icons[props.icon]}
        style={{color: "white", fontWeight: "normal"}}
      />
      </Card>
  )
}

export default StatCard;