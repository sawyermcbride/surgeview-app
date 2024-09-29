import React, { useEffect, useRef } from 'react';


import {Row, Col, Typography} from 'antd';
import useChart from '../../hooks/useChart';

const {Title} = Typography;


const data = {
  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  datasets: [{
    label: 'Views',
    data: [12, 19, 3, 5, 2, 3],
    borderWidth: 1
  }]
}


const options =  {
  scales: {
    y: {
      beginAtZero: true
    }
  },
  plugins: {
    title: {
      display: true,
      text: 'Views Over Time' 
    }
  },
  responsive: true,
  mantainAspectRatio: true
}


const StatisticsGraphsView: React.FC = function() {
  const chartRef = useChart(data, options);
  const chartRef2 = useChart(data, options);

  return (
    <>
      <Title style={{textAlign: 'center'}} level={4}>Data Over Time</Title>  
      <Row justify={'center'} style={{marginTop: '10px', padding: '20px'}}>
        <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'}} 
              lg={12} xl={12} md={24} sm={24}>
            <div style={{width: '100%', height: '300px'}}>
              <canvas ref={chartRef}></canvas> {/* Optional: style the canvas */}
            </div>
        </Col>
        <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'}} 
            lg={12} xl={12} md={24} sm={24}>
            <div style={{width: '100%', height: '300px'}}>
              <canvas ref={chartRef2}></canvas>
            </div>
        </Col>
      </Row>
    </>
  );
}

export default StatisticsGraphsView;