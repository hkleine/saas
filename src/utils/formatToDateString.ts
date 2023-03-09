export function formatToDateString(stringDate: string) {
  const date = new Date(stringDate);
  return date.toLocaleDateString('de', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
