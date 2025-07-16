import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

export function getReadableDate(date: Date): string {
  const m = moment(date);

  if (m.isSame(moment(), "day")) return "Today";
  if (m.isSame(moment().subtract(1, "day"), "day")) return "Yesterday";
  if (m.isSame(moment().add(1, "day"), "day")) return "Tomorrow";

  return m.isSame(moment(), "year")
    ? m.format("MMMM D") // e.g., "June 8"
    : m.format("MMMM D, YYYY"); // e.g., "November 7, 2025"
}

// E.g: 08:00, 19:23
export function getFormattedTimeString(date: Date) {
  let hours = date.getHours().toString();
  if (hours.length === 1) {
    hours = "0" + hours;
  }
  let minutes = date.getMinutes().toString();
  if (minutes.length === 1) {
    minutes = "0" + minutes;
  }
  return hours + ":" + minutes;
}

export function getSundayBasedWeekday(mondayBasedWeekday: number) {
  return (mondayBasedWeekday + 1) % 7;
}

export function getMondayBasedWeekday(sundayBasedWeekday: number) {
  return (sundayBasedWeekday - 1 + 7) % 7;
}

// Returns "mon" | "sun". "mon" by default
export async function getFirstDayOfWeek(): Promise<string> {
  return (await AsyncStorage.getItem("first-day-of-week")) || "mon";
}

export function substractDaysFromDate(date: Date, cntDays: number) {
  const milliseconds = date.getTime();
  const dailyMilliseconds = 24 * 60 * 60 * 1000;
  return new Date(milliseconds - dailyMilliseconds * cntDays);
}

export function addDaystoDate(date: Date, cntDays: number) {
  const milliseconds = date.getTime();
  const dailyMilliseconds = 24 * 60 * 60 * 1000;
  return new Date(milliseconds + dailyMilliseconds * cntDays);
}

/** Converts Date object to YYYY-MM-DD like string. Ignores the time. */
export function dateToYMD(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Converts YYYY-MM-DD formatted date string to Date object. */
export function YMDToDate(ymd: string): Date {
  const [year, month, day] = ymd.split("-").map((str) => Number(str));
  return new Date(year, month - 1, day);
}
