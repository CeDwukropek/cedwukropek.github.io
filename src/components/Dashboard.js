import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function Dashboard({ filaments }) {
  const [groupBy, setGroupBy] = useState("color");

  const totalWeight = filaments.reduce((sum, f) => sum + f.quantity, 0);

  // Grupowanie dynamiczne
  const grouped = filaments.reduce((acc, f) => {
    let key;
    if (groupBy === "name") key = f.name;
    else if (groupBy === "brand") key = f.tags?.brand?.[0] || "Inne";
    else if (groupBy === "material") key = f.tags?.material?.[0] || "Inne";
    else if (groupBy === "color") key = f.tags?.color?.[0] || "Inne";
    else key = "Inne";

    acc[key] = (acc[key] || 0) + f.quantity;
    return acc;
  }, {});

  const labels = Object.keys(grouped);
  const dataValues = Object.values(grouped);

  const data = {
    labels,
    datasets: [
      {
        label: "Waga (g)",
        data: dataValues,
        backgroundColor: [
          "#3b82f6",
          "#ef4444",
          "#10b981",
          "#f59e0b",
          "#8b5cf6",
          "#ec4899",
          "#14b8a6",
          "#f97316",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 20,
          padding: 15,
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: function (ctx) {
            const value = ctx.raw;
            const percent = ((value / totalWeight) * 100).toFixed(1);
            return `${ctx.label}: ${value}g (${percent}%)`;
          },
        },
      },
      title: {
        display: true,
        text: `Rozkład wagowy wg ${groupBy}`,
        font: { size: 18 },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto 2rem auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <select
        value={groupBy}
        onChange={(e) => setGroupBy(e.target.value)}
        style={{
          marginBottom: "1rem",
        }}
      >
        <option value="color">Kolor</option>
        <option value="brand">Marka</option>
        <option value="material">Materiał</option>
        <option value="name">Nazwa</option>
      </select>

      <div style={{ height: "400px" }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

export default Dashboard;
