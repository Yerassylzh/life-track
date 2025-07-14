import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const taskTable = sqliteTable("task", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  targetDate: integer("targetDate", { mode: "timestamp" }).notNull(),
  completedAt: integer("completedAt", { mode: "timestamp" }),
  reminder: integer("reminder", { mode: "timestamp" }),
});

export type Task = typeof taskTable.$inferSelect;

export const habitTable = sqliteTable("habit", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  color: text("color").notNull(),
  repeatType: text("repeatType", {
    enum: ["daily", "weekly", "monthly"],
  }).notNull(),
  daysOfWeek: text("daysOfWeek").notNull(), // store as JSON string
  weeklyFreq: integer("weeklyFreq").notNull(),
  monthlyDays: text("monthlyDays").notNull(), // store as JSON string
  reminder: text("reminder"), // can store notification id or custom string
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export type Habit = typeof habitTable.$inferSelect;

export const habitRelations = relations(habitTable, ({ many }) => ({
  completions: many(habitCompletionTable),
}));

export const habitCompletionTable = sqliteTable("habit_completion", {
  id: text("id").primaryKey().notNull(),
  habitId: text("habitId").references(() => habitTable.id, {
    onDelete: "cascade",
  }),
  completedAt: integer("completedAt", { mode: "timestamp" }).notNull(),
});

export type HabitCompletion = typeof habitCompletionTable.$inferSelect;

export const habitCompletionRelations = relations(
  habitCompletionTable,
  ({ one }) => ({
    habit: one(habitTable, {
      fields: [habitCompletionTable.habitId],
      references: [habitTable.id],
    }),
  })
);

export const noteTable = sqliteTable("note", {
  id: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  editedAt: integer("editedAt", { mode: "timestamp" }).notNull(),
  images: text("images").notNull(), // store as JSON string
  color: text("color").notNull(),
});

export type Note = typeof noteTable.$inferSelect;
