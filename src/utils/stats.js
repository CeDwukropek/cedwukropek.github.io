// utils/stats.js
import { stringToColor } from "./stringToColor";
import {
  subWeeks,
  subMonths,
  subYears,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  eachMonthOfInterval,
  format,
  addDays,
  addMonths,
  addYears,
  parseISO,
} from "date-fns";
import { pl } from "date-fns/locale";

export function getUsageBy(
  logs,
  filaments = [],
  groupBy = "global",
  range = "month"
) {
  const now = new Date();

  let from,
    to,
    prevFrom,
    prevTo,
    rawLabels = [],
    labelFormatter = (d) => d;

  // Ustalamy zakresy (pełne okresy kalendarzowe)
  if (range === "week") {
    from = startOfWeek(now, { weekStartsOn: 1 }); // poniedziałek
    to = endOfWeek(now, { weekStartsOn: 1 }); // niedziela
    prevFrom = subWeeks(from, 1);
    prevTo = subWeeks(to, 1);

    const days = eachDayOfInterval({ start: from, end: to });
    // rawLabels jako pełne ISO daty (yyyy-MM-dd)
    rawLabels = days.map((d) => format(d, "yyyy-MM-dd"));
    labelFormatter = (d) => format(parseISO(d), "dd.MM", { locale: pl });
  } else if (range === "month") {
    from = startOfMonth(now);
    to = endOfMonth(now);
    prevFrom = subMonths(from, 1);
    prevTo = endOfMonth(prevFrom);

    const days = eachDayOfInterval({ start: from, end: to });
    rawLabels = days.map((d) => format(d, "yyyy-MM-dd"));
    labelFormatter = (d) => format(parseISO(d), "d", { locale: pl });
  } else if (range === "year") {
    from = startOfYear(now);
    to = endOfYear(now);
    prevFrom = subYears(from, 1);
    prevTo = endOfYear(prevFrom);

    const months = eachMonthOfInterval({ start: from, end: to });
    // dla miesięcy trzymamy klucz jako pierwszy dzień miesiąca YYYY-MM-01
    rawLabels = months.map((d) => format(d, "yyyy-MM-01"));
    labelFormatter = (d) => format(parseISO(d), "MMM", { locale: pl });
  }

  // Filtr logów należących do danego okresu (i tylko zużycia: quantity < 0)
  const filterLogs = (logsArr, start, end) =>
    logsArr.filter((log) => {
      const date = new Date(log.time.seconds * 1000);
      return date >= start && date <= end && log.quantity < 0;
    });

  const currentLogs = filterLogs(logs, from, to);
  const prevLogs = filterLogs(logs, prevFrom, prevTo);

  // Grupowanie logów do struktury { groupKey: { "yyyy-MM-dd": grams, ... }, ... }
  const groupLogs = (logsArr) => {
    const grouped = {};
    logsArr.forEach((log) => {
      const filament = filaments.find((f) => f.id === log.filamentID);
      const groupKey =
        groupBy === "color"
          ? filament?.tags?.color?.[0] || "Inne"
          : groupBy === "brand"
          ? filament?.tags?.brand?.[0] || "Inne"
          : groupBy === "filament"
          ? filament?.name || "Inne"
          : groupBy === "material"
          ? filament?.tags?.material?.[0] || "Inne"
          : "global";

      const date = new Date(log.time.seconds * 1000);

      // klucz: pełna data ISO; dla 'year' używamy 'YYYY-MM-01' (pierwszy dzień miesiąca)
      const key =
        range === "year"
          ? format(date, "yyyy-MM-01")
          : format(date, "yyyy-MM-dd");

      if (!grouped[groupKey]) grouped[groupKey] = {};
      grouped[groupKey][key] =
        (grouped[groupKey][key] || 0) + Math.abs(log.quantity);
    });
    return grouped;
  };

  const grouped = groupLogs(currentLogs);
  const prevGrouped = groupLogs(prevLogs);

  // sumy
  const totalUsage = currentLogs.reduce((s, l) => s + Math.abs(l.quantity), 0);
  const prevTotalUsage = prevLogs.reduce((s, l) => s + Math.abs(l.quantity), 0);

  // PRZESUNIĘCIE poprzedniego okresu *o ten sam okres* do przodu,
  // żeby wpasować go w bieżące rawLabels (np. poprzedni tydzień -> current week)
  const shiftPrevData = (data) => {
    const shifted = {};
    Object.entries(data).forEach(([groupKey, values]) => {
      shifted[groupKey] = {};
      Object.entries(values).forEach(([dateISO, value]) => {
        // dateISO jest w formacie "yyyy-MM-dd" lub "yyyy-MM-01"
        const parsed = parseISO(dateISO);
        let shiftedDateObj;
        if (range === "week") {
          shiftedDateObj = addDays(parsed, 7);
        } else if (range === "month") {
          shiftedDateObj = addMonths(parsed, 1);
        } else if (range === "year") {
          shiftedDateObj = addYears(parsed, 1);
        } else {
          shiftedDateObj = parsed;
        }

        const shiftedKey =
          range === "year"
            ? format(shiftedDateObj, "yyyy-MM-01")
            : format(shiftedDateObj, "yyyy-MM-dd");

        // Jeżeli kilka wpisów po przesunięciu wpadnie na ten sam dzień, sumujemy
        shifted[groupKey][shiftedKey] =
          (shifted[groupKey][shiftedKey] || 0) + value;
      });
    });
    return shifted;
  };

  const shiftedPrevData = shiftPrevData(prevGrouped);

  // Tworzymy datasety: aktualne + przesunięte poprzednie (przerywana linia)
  const datasets = [
    // bieżące
    ...Object.entries(grouped).map(([labelKey, data]) => {
      const color = stringToColor(labelKey);
      return {
        label: labelKey,
        data: rawLabels.map((d) => data[d] || 0),
        borderColor: color,
        backgroundColor: color + "55",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      };
    }),

    // poprzednie (przesunięte)
    ...Object.entries(shiftedPrevData).map(([labelKey, data]) => {
      const color = stringToColor(labelKey);
      return {
        label: `${labelKey} (poprz. okres)`,
        data: rawLabels.map((d) => data[d] || 0),
        borderColor: color,
        borderDash: [6, 6],
        pointRadius: 0,
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0.3,
        fill: false,
      };
    }),
  ];

  // labels do wyświetlenia (produktywnie sformatowane)
  const labels = rawLabels.map((d) => labelFormatter(d));

  return { labels, datasets, totalUsage, prevTotalUsage };
}
