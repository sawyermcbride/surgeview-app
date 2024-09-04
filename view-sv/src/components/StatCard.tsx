import React, {useState, ReactNode, useEffect} from "react";

import { Card, Row, Col, Statistic} from "antd";
import { HomeOutlined, UserOutlined, SettingOutlined, BarChartOutlined } from "@ant-design/icons";


type Colors = {
  green: string;
  red: string;
  yellow: string;
  blue: string;
  white: string;
  black: string;
}

type Icons = {
  home: ReactNode,
  user: ReactNode,
  setting: ReactNode,
  bar_chart: ReactNode
}

interface StatCardProps {
  color: keyof Colors, 
  textColor: keyof Colors,
  icon: keyof Icons, 
  text: string, 
  data: number,
  suffix: string,
  isMobile: boolean
}


const StatCard: React.FC<StatCardProps> = (props) => {

  
  const colors: Colors = {
    green: "#27ae60",
    red: "#c0392b",
    yellow: "#f1c40f",
    blue: "#3498db",
    white: "#ecf0f1",
    black: "#333333"

  };

  const icons: Icons = {
    home: <HomeOutlined/>,
    user: <UserOutlined/>,
    setting: <SettingOutlined/>,
    bar_chart: <BarChartOutlined/>
  }

  useEffect(() => {
    const elems = document.querySelectorAll('.ant-statistic div.ant-statistic-title');
    const getTitleElems = Array.from(elems).filter(e => e.textContent?.includes(props.text));
    console.log(`Rendering font for isMobile = ${props.isMobile} at size = ${(props.isMobile ? '10px' : '15px')}`);
    getTitleElems.forEach( (e) => {
      e.style.fontSize = (props.isMobile ? '10px' : '14px');
      if(props.color === 'white') {
        e.style.color = '#333333';
      } else {
        e.style.color = colors.white;
      }
    }
  )
  }, [props.isMobile]);

  return (
      <Card
        style={{ 
          width: (props.isMobile ? 175 : 250), 
          backgroundColor: colors[props.color], // Dark background
          color: (props.color === 'white'? '#333333 !important' :'#fff !important'), // White text color
          margin: "5px 10px",
          borderRadius: 8,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s', // Smooth transition
          
        }}
        className=""
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
        valueStyle={{fontSize:(props.isMobile ? "15px":"20px") , color: colors[props.textColor]}}
        style={{fontWeight: "normal"}}
        className="statistic-white-text"
      />
      </Card>
  )
}

export default StatCard;