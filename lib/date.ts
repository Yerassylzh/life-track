import moment from "moment";

export function getReadableDate(date: Date): string {
  const m = moment(date);

  if (m.isSame(moment(), "day")) return "Today";
  if (m.isSame(moment().subtract(1, "day"), "day")) return "Yesterday";

  return m.isSame(moment(), "year")
    ? m.format("MMMM D") // e.g., "June 8"
    : m.format("MMMM D, YYYY"); // e.g., "November 7, 2025"
}
