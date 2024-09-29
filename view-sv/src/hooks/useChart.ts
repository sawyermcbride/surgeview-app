import {useEffect, useRef} from "react";
import {Chart, registerables, ChartData, ChartOptions} from "chart.js";

Chart.register(...registerables);

/**
 * Custom hook to create and manage a Chart.js chart.
 *
 * @param {Chart.ChartData} data - The data for the chart.
 * @param {Chart.ChartOptions} options - The configuration options for the chart.
 * @returns {void}
 *
 * @remarks
 * This hook initializes a Chart.js chart on a canvas element and updates it whenever the data or options change.
 * It also ensures that the chart instance is properly destroyed to avoid memory leaks.
 *
 * @example
 * ```typescript
 * const data = {
 *   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
 *   datasets: [{
 *     label: 'My First dataset',
 *     backgroundColor: 'rgba(255,99,132,0.2)',
 *     borderColor: 'rgba(255,99,132,1)',
 *     borderWidth: 1,
 *     hoverBackgroundColor: 'rgba(255,99,132,0.4)',
 *     hoverBorderColor: 'rgba(255,99,132,1)',
 *     data: [65, 59, 80, 81, 56, 55, 40]
 *   }]
 * };
 *
 * const options = {
 *   responsive: true,
 *   maintainAspectRatio: false
 * };
 *
 * useChart(data, options);
 * ```
 */
const useChart = function(data: ChartData, options: ChartOptions) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);


  useEffect( () => {
    const ctx = chartRef.current?.getContext('2d');

    if(chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if(ctx){ 
      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
      });
    
    }

    return () => {
      if(chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    }

  }, [data, options])

  return chartRef;

}

export default useChart;