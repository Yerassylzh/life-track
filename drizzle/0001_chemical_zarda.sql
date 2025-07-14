PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_habit_completion` (
	`id` text PRIMARY KEY NOT NULL,
	`habitId` text,
	`completedAt` integer NOT NULL,
	FOREIGN KEY (`habitId`) REFERENCES `habit`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_habit_completion`("id", "habitId", "completedAt") SELECT "id", "habitId", "completedAt" FROM `habit_completion`;--> statement-breakpoint
DROP TABLE `habit_completion`;--> statement-breakpoint
ALTER TABLE `__new_habit_completion` RENAME TO `habit_completion`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `habit` ADD `created_at` integer DEFAULT (strftime('%s', 'now'));