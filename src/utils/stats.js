import { stringToColor } from "./stringToColor";

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

  let totalUsage = 0;

  const grouped = {};
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

    if (log.quantity < 0) totalUsage += log.quantity * -1;
  });

  const datasets = Object.entries(grouped).map(([key, data], i) => {
    const color = stringToColor(key);
    return {
      label: key,
      data: labels.map((d) => data[d] || 0),
      borderColor: color,
      backgroundColor: color + "55", // półprzezroczyste wypełnienie
      borderWidth: 2,
      tension: 0.3, // lekko wygładzone linie
      fill: true,
    };
  });

  return { labels, datasets, totalUsage };
}
