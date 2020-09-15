import React, { FunctionComponent } from "react";
import { Bar, HorizontalBar, Doughnut, Pie } from "react-chartjs-2";

const colors = [
  '#f39c12',
  '#2980b9',
  '#27ae60',
  '#c0392b',
  '#8e44ad',
  '#2c3e50',
  '#16a085',
  '#d35400',
  '#2c3e50',
];

type FormComponentProps = {
  title: string;
  type: string;
  labels: any;
  dataLabels: any;
  multiColors?: boolean;
};

const Chart: FunctionComponent<FormComponentProps> = ({ title, type, labels, dataLabels, multiColors = false }) => {
  const data = {
    labels,
    datasets: [
      {
        label: title,
        fill: false,
        lineTension: 0.1,
        backgroundColor: multiColors ? colors : "#3498db",
        borderColor: "white",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: dataLabels
      }
    ]
  };
  return (
    <div>
      {type === "bar" && <Bar data={data} />}
      {type === "horizontal-bar" && <HorizontalBar data={data} />}
      {type === "doughnut" && <Doughnut data={data} />}
      {type === "pie" && <Pie data={data} />}
    </div>
  );
};

export default Chart;
