export function formatRelativeDate(seconds) {
  const now = Date.now();
  const diff = now - seconds * 1000; // w ms

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "przed chwilą";
  if (minutes < 60) return `${minutes} min temu`;
  if (hours < 24) return `${hours} h temu`;
  if (days < 7) return `${days} dni temu`;

  // fallback – normalna data
  return new Date(seconds * 1000).toLocaleDateString("pl-PL");
}
