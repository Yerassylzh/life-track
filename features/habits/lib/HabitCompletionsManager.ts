import { HabitWithCompletions } from "@/db/types";
import {
  addDaystoDate,
  dateToYMD,
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
}

/*
  Here is quite a big problem:
   - If user created habit at the 10th of current month and said habit should be completed at 7th and 17th.
    - We need to accept full monthly completion if 17th was completed.
    - For that skip the 7th.
   - If user created daily habit which should be completed on Monday and Wednesday and he created that habit on Tuesday:
    - Just skip Monday for such case
*/
