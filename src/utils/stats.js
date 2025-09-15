export function getMonthlyUsageBy(logs, filaments = [], groupBy = "global") {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const monthLogs = logs.filter((log) => {
    const date = new Date(log.time.seconds * 1000);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      log.quantity < 0
    );
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const grouped = {};

  const colors = [
    "#FF6384", // róż
    "#36A2EB", // niebieski
    "#FFCE56", // żółty
    "#4BC0C0", // turkus
    "#9966FF", // fiolet
    "#FF9F40", // pomarańcz
  ];

  // funkcja pomocnicza do generowania koloru dla datasetu
  const getColor = (index) => colors[index % colors.length];

  monthLogs.forEach((log) => {
    const filament = filaments.find((f) => f.id === log.filamentID);
    const groupKey =
      groupBy === "color"
        ? filament?.tags?.color?.[0] || "Inne"
        : groupBy === "brand"
        ? filament?.tags?.brand?.[0] || "Inne"
        : groupBy === "filament"
        ? filament?.name || "Inne"
        : "global";

    const date = new Date(log.time.seconds * 1000);
    const day = date.getDate();

    if (!grouped[groupKey]) grouped[groupKey] = {};
    grouped[groupKey][day] = (grouped[groupKey][day] || 0) + log.quantity * -1;
  });

  const datasets = Object.entries(grouped).map(([key, data], i) => ({
    label: key,
    data: labels.map((d) => data[d] || 0),
    borderColor: getColor(i),
    backgroundColor: getColor(i) + "55", // półprzezroczyste wypełnienie
    borderWidth: 2,
    tension: 0.3, // lekko wygładzone linie
    fill: true,
  }));

  return { labels, datasets };
}
