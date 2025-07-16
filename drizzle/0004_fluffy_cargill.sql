PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_task` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`createdAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`targetDate` integer NOT NULL,
	`completedAt` integer,
	`reminder` integer
);
--> statement-breakpoint
INSERT INTO `__new_task`("id", "name", "createdAt", "targetDate", "completedAt", "reminder") SELECT "id", "name", "createdAt", "targetDate", "completedAt", "reminder" FROM `task`;--> statement-breakpoint
DROP TABLE `task`;--> statement-breakpoint
ALTER TABLE `__new_task` RENAME TO `task`;--> statement-breakpoint
PRAGMA foreign_keys=ON;