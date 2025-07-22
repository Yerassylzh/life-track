import { v4 as uuid } from "uuid";
import { db } from "./db/db";
import { habitCompletionTable, habitTable, taskTable } from "./db/schema";
import { habitIcons } from "./features/habits/lib/icons";
import { ColorPalette } from "./lib/colors";
import { addDaystoDate, dateToYMD, YMDToDate } from "./lib/date";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function generateFakeData() {
  // 1. Create 4-7 habits (some checkbox, some numeric)
  const habitDefs: {
    name: string;
    description: string;
    unit: string | null;
    iconName: string;
    colorIndex: number;
    repeatType: "daily" | "weekly" | "monthly";
    daysOfWeek: number[];
    weeklyFreq: number;
    monthlyDays: number[];
  }[] = [
    {
      name: "Drink Water",
      description: "Drink 8 glasses of water",
      unit: null,
      iconName: habitIcons[0],
      colorIndex: 0,
      repeatType: "daily",
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      weeklyFreq: 7,
      monthlyDays: [],
    },
    {
      name: "Read Pages",
      description: "Read at least 10 pages",
      unit: "pages",
      iconName: habitIcons[2],
      colorIndex: 1,
      repeatType: "daily",
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      weeklyFreq: 7,
      monthlyDays: [],
    },
    {
      name: "Exercise",
      description: "Do 30 minutes of exercise",
      unit: null,
      iconName: habitIcons[5],
      colorIndex: 2,
      repeatType: "weekly",
      daysOfWeek: [1, 3, 5],
      weeklyFreq: 3,
      monthlyDays: [],
    },
    {
      name: "Meditate",
      description: "Meditate for 10 minutes",
      unit: null,
      iconName: habitIcons[15],
      colorIndex: 3,
      repeatType: "daily",
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      weeklyFreq: 7,
      monthlyDays: [],
    },
    {
      name: "Steps Walked",
      description: "Walk at least 5000 steps",
      unit: "steps",
      iconName: habitIcons[18],
      colorIndex: 4,
      repeatType: "daily",
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      weeklyFreq: 7,
      monthlyDays: [],
    },
    {
      name: "No Sugar",
      description: "Avoid sugar for the day",
      unit: null,
      iconName: habitIcons[9],
      colorIndex: 5,
      repeatType: "daily",
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      weeklyFreq: 7,
      monthlyDays: [],
    },
  ];

  // 2. Insert habits
  const habitIds: string[] = [];
  for (const def of habitDefs) {
    const id = uuid();
    await db.insert(habitTable).values({
      id,
      name: def.name,
      description: def.description,
      unit: def.unit,
      iconName: def.iconName,
      color: ColorPalette[def.colorIndex],
      repeatType: def.repeatType,
      daysOfWeek: JSON.stringify(def.daysOfWeek),
      weeklyFreq: def.weeklyFreq,
      monthlyDays: JSON.stringify(def.monthlyDays),
      reminder: null,
      createdAt: YMDToDate(dateToYMD(addDaystoDate(new Date(), -365))),
    });
    habitIds.push(id);
  }

  // 3. Insert completions for each habit for the past year
  for (let i = 0; i < habitDefs.length; i++) {
    const def = habitDefs[i];
    const habitId = habitIds[i];
    let date = addDaystoDate(new Date(), -365);
    for (let d = 0; d < 365; d++) {
      // Randomly decide if completed
      const completed = Math.random() < 0.7; // 70% chance
      if (completed) {
        await db.insert(habitCompletionTable).values({
          id: uuid(),
          habitId,
          completedAt: YMDToDate(dateToYMD(date)),
          unitValue: def.unit ? getRandomInt(10, 30) : null,
        });
      }
      date = addDaystoDate(date, 1);
    }
  }

  // 4. Create 20 fake tasks for previous dates
  for (let i = 0; i < 20; i++) {
    const id = uuid();
    const daysAgo = getRandomInt(0, 365);
    const date = addDaystoDate(new Date(), -daysAgo);
    await db.insert(taskTable).values({
      id,
      name: `Task #${i + 1}`,
      targetDate: YMDToDate(dateToYMD(date)),
      reminder: null,
      createdAt: YMDToDate(dateToYMD(date)),
      completedAt:
        Math.random() < 0.5
          ? YMDToDate(dateToYMD(addDaystoDate(date, 1)))
          : null,
    });
  }

  console.log("Fake habits, completions, and tasks generated!");
}
