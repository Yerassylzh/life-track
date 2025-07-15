PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_habit` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`unit` text,
	`color` text NOT NULL,
	`repeatType` text NOT NULL,
	`daysOfWeek` text NOT NULL,
	`weeklyFreq` integer NOT NULL,
	`monthlyDays` text NOT NULL,
	`reminder` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_habit`("id", "name", "description", "unit", "color", "repeatType", "daysOfWeek", "weeklyFreq", "monthlyDays", "reminder", "created_at") SELECT "id", "name", "description", "unit", "color", "repeatType", "daysOfWeek", "weeklyFreq", "monthlyDays", "reminder", "created_at" FROM `habit`;--> statement-breakpoint
DROP TABLE `habit`;--> statement-breakpoint
ALTER TABLE `__new_habit` RENAME TO `habit`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `habit_completion` ADD `unitValue` integer;