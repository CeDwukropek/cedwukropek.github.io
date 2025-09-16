import { Line } from "react-chartjs-2";
import { getUsageBy } from "../utils/stats";
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
  const [range, setRange] = useState("month"); // "week" | "month" | "year"

  const { labels, datasets, totalUsage, prevTotalUsage } = getUsageBy(
    logs,
    filaments,
    groupBy,
    range
  );

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
          apdding: 15,
        },
      },
      title: {
        display: true,
        text: "Zużycie filamentu",
        font: { size: 16 },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Dzień",
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

  const diff =
    prevTotalUsage > 0
      ? (((totalUsage - prevTotalUsage) / prevTotalUsage) * 100).toFixed(1)
      : null;

  return (
    <div style={{ height: "400px", marginBottom: "2rem" }}>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <select
          className="select"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="week">Ostatni tydzień</option>
          <option value="month">Ostatni miesiąc</option>
          <option value="year">Ostatni rok</option>
        </select>

        <select
          className="select"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
        >
          <option value="global">Całość</option>
          <option value="color">Kolor</option>
          <option value="material">Materiał</option>
          <option value="brand">Brand</option>
          <option value="filament">Filament</option>
        </select>
      </div>

      <small>
        <span style={{ color: "var(--text-50)" }}>Total:</span>{" "}
        {Number(totalUsage).toLocaleString("pl-PL")}g
        {diff !== null && (
          <span
            style={{ marginLeft: "0.5rem", color: diff >= 0 ? "red" : "green" }}
          >
            {diff >= 0 ? "+" : ""}
            {diff}% vs poprzedni okres ({prevTotalUsage}g)
          </span>
        )}
      </small>

      <Line data={data} options={options} />
    </div>
  );
}

export default UsageChart;
