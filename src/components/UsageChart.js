import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { getMonthlyUsage } from "../utils/stats";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function UsageChart({ logs }) {
  const { labels, values } = getMonthlyUsage(logs);

  const data = {
    labels,
    datasets: [
      {
        label: "Zużycie filamentu (g)",
        data: values,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: true, text: "Zużycie filamentu w tym miesiącu" },
    },
    scales: {
      x: { title: { display: true, text: "Dzień miesiąca" } },
      y: { title: { display: true, text: "Zużycie (g)" } },
    },
  };

  return <Line data={data} options={{ options, maintainAspectRatio: false }} />;
}

export default UsageChart;
