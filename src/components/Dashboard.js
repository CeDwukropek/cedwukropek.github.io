import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { useState } from "react";
import "./charts.css";
import { stringToColor } from "../utils/stringToColor.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function Dashboard({ filaments }) {
  const [groupBy, setGroupBy] = useState("color");

  const totalWeight = filaments
    .reduce((sum, f) => sum + f.quantity, 0)
    .toFixed(2);

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

  const groupedArray = Object.entries(grouped).map(([label, value]) => {
    return {
      label,
      value,
      color: stringToColor(label),
    };
  });

  const labels = groupedArray.map((g) => g.label);
  const dataValues = groupedArray.map((g) => g.value);
  const colors = groupedArray.map((g) => g.color);

  const data = {
    labels,
    datasets: [
      {
        label: "Waga (g)",
        data: dataValues,
        borderColor: colors,
        backgroundColor: colors.map((c) => c + "55"),
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
        font: { size: 16 },
      },
    },
  };

  return (
    <div
      style={{
        margin: "0 auto 2rem auto",
        width: "100%",
      }}
    >
      <select
        className="select"
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
      <br></br>
      <small>
        <span style={{ color: "var(--text-50)" }}>Total:</span>{" "}
        {Number(totalWeight).toLocaleString("pl-PL", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}
        g
      </small>

      <div style={{ height: "400px" }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

export default Dashboard;
