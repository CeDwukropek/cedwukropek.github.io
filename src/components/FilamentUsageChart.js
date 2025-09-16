// components/FilamentUsageChart.js
import { Line } from "react-chartjs-2";
import { getUsageBy } from "../utils/stats";
import { useState } from "react";

function FilamentUsageChart({ filament, logs }) {
  const [range, setRange] = useState("week");
  if (!filament || !logs) return null;

  // filtrowanie logów pod dany filament
  const filamentLogs = logs.filter((log) => log.filamentID === filament.id);

  // generowanie danych (np. domyślnie "month")
  const { labels, datasets, totalUsage, prevTotalUsage } = getUsageBy(
    filamentLogs,
    [filament], // przekazujemy tylko ten filament
    "global",
    range
  );
  const data = { labels, datasets };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Zużycie (g)",
        },
      },
    },
  };

  return (
    <div className="filament-usage-chart">
      <h3>Zużycie w czasie</h3>
      <select
        className="select"
        value={range}
        onChange={(e) => setRange(e.target.value)}
        style={{ marginBottom: "1rem" }}
      >
        <option value="week">Ostatni tydzień</option>
        <option value="month">Ostatni miesiąc</option>
        <option value="year">Ostatni rok</option>
      </select>
      <Line data={data} options={options} />
      <p>
        <b>Zużycie w tym okresie:</b> {totalUsage.toFixed(1)} g <br />
        <b>Poprzedni okres:</b> {prevTotalUsage.toFixed(1)} g
      </p>
    </div>
  );
}

export default FilamentUsageChart;
