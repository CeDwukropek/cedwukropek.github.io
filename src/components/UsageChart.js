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
} from "chart.js";

// Rejestracja wszystkiego co potrzebne do LineChart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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
      title: { display: true, text: "Zużycie filamentu w tym miesiącu" },
    },
    scales: {
      x: { title: { display: true, text: "Dzień miesiąca" } },
      y: { title: { display: true, text: "Zużycie (g)" } },
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
