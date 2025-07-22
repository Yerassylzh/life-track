import { HabitWithCompletions } from "@/db/types";
import {
  addDaystoDate,
  dateToYMD,
  getMondayBasedWeekday,
  getSundayBasedWeekday,
  substractDaysFromDate,
  YMDToDate,
} from "@/lib/date";

type KeyType = string; // e.g. 2025-07-13

export enum CompletionStatus {
  Completed = 1,
  DoesntNeedToComplete = 2,
  Uncompleted = 3,
}

export class HabitCompletionsManager {
  private habit: HabitWithCompletions;
  private completionData: Map<KeyType, CompletionStatus>;
  private firstDayOfWeek: "mon" | "sun";
  private completions: Set<string>;

  constructor(habit: HabitWithCompletions, firstDayOfWeek: "mon" | "sun") {
    this.habit = habit;
    this.firstDayOfWeek = firstDayOfWeek;
    this.completions = new Set(
      habit.completions.map((completion) => dateToYMD(completion.completedAt))
    );
    this.completionData = new Map();
    for (const completion of this.completions) {
      this.completionData.set(completion, CompletionStatus.Completed);
    }

    this.processCompletions();
    // console.log(this.completionData);
  }

  isHabitCompletedAt(dateYMD: string): boolean | undefined {
    return this.completionData.get(dateYMD) === CompletionStatus.Completed;
  }

  isHabitDoesntNeedToCompleteAt(dateYMD: string): boolean | undefined {
    return (
      this.completionData.get(dateYMD) === CompletionStatus.DoesntNeedToComplete
    );
  }

  private processCompletions() {
    if (this.habit.repeatType === "daily") {
      return this.processCompletionsDaily();
    }
    if (this.habit.repeatType === "weekly") {
      return this.processCompletionsWeekly();
    }
    return this.processCompletionsMonthly();
  }

  private processCompletionsDaily() {
    const chunks = this.getWeekChunks();
    const daysOfWeek: number[] = JSON.parse(this.habit.daysOfWeek); // [0..6] => [mon...sun]
    const today = YMDToDate(dateToYMD(new Date()));

    for (const weekChunk of chunks) {
      let isWeekCompleted = daysOfWeek.every((monWeekday) => {
        let weekday =
          this.firstDayOfWeek === "mon"
            ? monWeekday
            : getSundayBasedWeekday(monWeekday);

        if (YMDToDate(weekChunk[weekday]) < today) {
          return true; // Just skip. This problem stated at the end of file.
        }
        return (
          this.completionData.has(weekChunk[weekday]) &&
          this.completionData.get(weekChunk[weekday]) ===
            CompletionStatus.Completed
        );
      });

      for (const weekdayYMD of weekChunk) {
        if (this.completionData.has(weekdayYMD)) {
          continue;
        }
        this.completionData.set(
          weekdayYMD,
          isWeekCompleted
            ? CompletionStatus.DoesntNeedToComplete
            : CompletionStatus.Uncompleted
        );
      }
    }
  }

  private processCompletionsWeekly() {
    const chunks = this.getWeekChunks();
    const weeklyFreq = this.habit.weeklyFreq;

    for (const weekChunk of chunks) {
      let count = 0;
      // console.log("\n\n\n");
      for (const weekdayYMD of weekChunk) {
        if (
          this.completionData.has(weekdayYMD) &&
          this.completionData.get(weekdayYMD) === CompletionStatus.Completed
        ) {
          count++;
        }
      }
      const isWeekCompleted = count >= weeklyFreq;

      for (const weekdayYMD of weekChunk) {
        if (!this.completionData.has(weekdayYMD)) {
          this.completionData.set(
            weekdayYMD,
            isWeekCompleted
              ? CompletionStatus.DoesntNeedToComplete
              : CompletionStatus.Uncompleted
          );
        }
      }
    }
  }

  private processCompletionsMonthly() {
    const chunks = this.getMonthChunks();
    const monthlyDays = new Set(JSON.stringify(this.habit.monthlyDays));
    const today = YMDToDate(dateToYMD(new Date()));

    for (const month of chunks) {
      let isMonthCompleted = true;
      for (const day of month) {
        if (!monthlyDays.has(day) || YMDToDate(day) < today) {
          continue;
        }
        if (
          !this.completionData.has(day) ||
          this.completionData.get(day) !== CompletionStatus.Completed
        ) {
          isMonthCompleted = false;
          break;
        }
      }

      for (const day of month) {
        if (this.completionData.has(day)) {
          continue;
        }
        this.completionData.set(
          day,
          isMonthCompleted
            ? CompletionStatus.DoesntNeedToComplete
            : CompletionStatus.Uncompleted
        );
      }
    }
  }

  private getWeekChunks() {
    let currentDate = new Date(this.habit.createdAt);

    const chunks: string[][] = [];
    const today = new Date();
    while (currentDate.getDay() !== (this.firstDayOfWeek === "mon" ? 1 : 0)) {
      currentDate = substractDaysFromDate(currentDate, 1);
    }
    while (currentDate <= today) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(dateToYMD(currentDate));
        currentDate = addDaystoDate(currentDate, 1);
      }
      chunks.push(week);
    }

    return chunks;
  }

  private getMonthChunks() {
    let currentDate = new Date(this.habit.createdAt);

    const chunks: string[][] = [];
    const today = new Date();
    while (currentDate.getDate() !== 1) {
      currentDate = substractDaysFromDate(currentDate, 1);
    }
    while (currentDate <= today) {
      const month = [];
      do {
        month.push(dateToYMD(currentDate));
        currentDate = addDaystoDate(currentDate, 1);
      } while (currentDate.getDate() !== 1);
      chunks.push(month);
    }
    return chunks;
  }

  /**
   * Returns the current streak of successful completions for this habit.
   */
  getCurrentStreak() {
    // Only consider scheduled days (not doesNotNeedToComplete)
    let streak = 0;
    let date = new Date();
    while (true) {
      const ymd = dateToYMD(date);
      if (this.isHabitDoesntNeedToCompleteAt(ymd)) {
        date = substractDaysFromDate(date, 1);
        continue;
      }
      if (this.isHabitCompletedAt(ymd)) {
        streak++;
      } else {
        break;
      }
      date = substractDaysFromDate(date, 1);
    }
    return streak;
  }

  /**
   * Returns the best (longest) streak of successful completions for this habit.
   */
  getBestStreak() {
    // Only consider scheduled days (not doesNotNeedToComplete)
    let best = 0;
    let current = 0;
    let date = new Date(this.habit.createdAt);
    const today = new Date();
    while (date <= today) {
      const ymd = dateToYMD(date);
      if (this.isHabitDoesntNeedToCompleteAt(ymd)) {
        date = addDaystoDate(date, 1);
        continue;
      }
      if (this.isHabitCompletedAt(ymd)) {
        current++;
        best = Math.max(best, current);
      } else {
        current = 0;
      }
      date = addDaystoDate(date, 1);
    }
    return best;
  }

  /**
   * Returns the total amount of completions for numeric habits in the given period.
   * @param {'week'|'month'|'year'|'all'} period
   */
  getCompletionsCount(period: "week" | "month" | "year" | "all" = "all") {
    if (this.habit.unit == null) return 0;
    const now = new Date();
    return this.habit.completions.reduce((sum, c) => {
      const d = new Date(c.completedAt);
      if (!this._isInPeriod(d, now, period)) return sum;
      return sum + (typeof c.unitValue === "number" ? c.unitValue : 0);
    }, 0);
  }

  /**
   * Returns the number of times the habit was completed in the given period.
   * @param {'week'|'month'|'year'|'all'} period
   */
  getTimesCompleted(period: "week" | "month" | "year" | "all" = "all") {
    const now = new Date();
    return this.habit.completions.reduce((count, c) => {
      const d = new Date(c.completedAt);
      if (!this._isInPeriod(d, now, period)) return count;
      return count + 1;
    }, 0);
  }

  /**
   * Returns the total number of successful completions (all time).
   */
  getTotalSuccess() {
    return this.habit.completions.length;
  }

  /**
   * Returns the total number of failures (all time).
   */
  getTotalFailure() {
    // Count all scheduled days (not doesNotNeedToComplete) that are not completed
    let failures = 0;
    let date = new Date(this.habit.createdAt);
    const today = new Date();
    while (date <= today) {
      const ymd = dateToYMD(date);
      if (this.isHabitDoesntNeedToCompleteAt(ymd)) {
        date = addDaystoDate(date, 1);
        continue;
      }
      if (!this.isHabitCompletedAt(ymd)) {
        failures++;
      }
      date = addDaystoDate(date, 1);
    }
    return failures;
  }

  /**
   * Helper: checks if a date is in the given period relative to now.
   */
  _isInPeriod(
    date: Date,
    now: Date,
    period: "week" | "month" | "year" | "all"
  ): boolean {
    if (period === "all") return true;
    if (period === "week") {
      // Make week Monday-based
      const nowDay = getMondayBasedWeekday(now.getDay());
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - nowDay);
      // startOfWeek is now the Monday of the current week
      return (
        dateToYMD(date) >= dateToYMD(startOfWeek) &&
        dateToYMD(date) <= dateToYMD(now)
      );
    }
    if (period === "month") {
      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      );
    }
    if (period === "year") {
      return date.getFullYear() === now.getFullYear();
    }
    return false;
  }
}

/*
  Here is quite a big problem:
   - If user created habit at the 10th of current month and said habit should be completed at 7th and 17th.
    - We need to accept full monthly completion if 17th was completed.
    - For that skip the 7th.
   - If user created daily habit which should be completed on Monday and Wednesday and he created that habit on Tuesday:
    - Just skip Monday for such case
*/
