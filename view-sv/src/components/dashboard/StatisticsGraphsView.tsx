import React from 'react';

import { Line } from 'react-chartjs-2';
import {Row, Col} from 'antd';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend,} from 'chart.js';

// Register components you need from Chart.js
ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title,
  Tooltip, Legend );

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Sales 2024 (in USD)',
      data: [500, 1000, 750, 1250, 1600, 2000, 2400],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
    },
  ],
};

const options = {
  responsive: true,
  outerHeight: 400,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Monthly Sales Data',
    },
  },
};

const StatisticsGraphsView: React.FC = function() {
  return (
    <div style={{height: '250px', display: 'flex', marginTop: '50px', justifyContent: 'flex-start'}}>
      <div style={{height: '100%', textAlign: 'center', width: '100%'}}>
      <h2 style={{textAlign: 'center'}}>Subscribers Over Time</h2>
        <Line data={data} options={options} />

      </div>
      <div style={{height: '100%', textAlign: 'center', width: '100%'}}>
        <h2>Views Over Time</h2>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default StatisticsGraphsView;