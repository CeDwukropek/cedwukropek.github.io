export function getMonthlyUsage(logs) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // bieżący miesiąc

  // Filtrujemy tylko logi z tego miesiąca i tylko te, które mają zużycie (quantity < 0)
  const monthLogs = logs.filter((log) => {
    const date = new Date(log.time.seconds * 1000);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      log.quantity < 0
    );
  });

  // Grupowanie po dniu
  const byDay = {};
  monthLogs.forEach((log) => {
    const date = new Date(log.time.seconds * 1000);
    const day = date.getDate(); // np. 6
    byDay[day] = (byDay[day] || 0) + Math.abs(log.quantity);
  });

  // Zwracamy tablice dla wszystkich dni miesiąca
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const values = labels.map((d) => byDay[d] || 0);

  return { labels, values };
}
