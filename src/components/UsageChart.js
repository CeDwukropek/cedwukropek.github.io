import { Line } from "react-chartjs-2";
import { getMonthlyUsageBy } from "../utils/stats";
import { useState } from "react";
import "./charts.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Rejestracja wszystkiego co potrzebne do LineChart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function UsageChart({ logs, filaments }) {
  const [groupBy, setGroupBy] = useState("global");
  const { labels, datasets } = getMonthlyUsageBy(logs, filaments, groupBy);

  const data = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          boxWidth: 12,
        },
      },
      title: {
        display: true,
        text: "Zużycie filamentu w tym miesiącu",
        font: { size: 16 },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Dzień miesiąca",
          font: { size: 12 },
        },
      },
      y: {
        title: {
          display: true,
          text: "Zużycie (g)",
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <div style={{ height: "400px" }}>
      <select
        className="select"
        value={groupBy}
        onChange={(e) => setGroupBy(e.target.value)}
      >
        <option value="global">Całość</option>
        <option value="color">Kolor</option>
        <option value="brand">Brand</option>
        <option value="filament">Filament</option>
      </select>

      <Line data={data} options={options} />
    </div>
  );
}

export default UsageChart;
