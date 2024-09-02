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
          color: '#fff !important', // White text color
          margin: "5px 10px",
          borderRadius: 8,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s', // Smooth transition
          
        }}
        className="card-white-text"
        bordered={true}
        hoverable // Makes the card respond to hover
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
      <Statistic
        title= {props.text}
        value={props.data}
        suffix={props.suffix}
        prefix={icons[props.icon]}
        style={{color: "white !important", fontWeight: "normal"}}
        className="statistic-white-text"
      />
      </Card>
  )
}

export default StatCard;