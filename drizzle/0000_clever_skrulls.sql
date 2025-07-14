CREATE TABLE `habit_completion` (
	`id` text PRIMARY KEY NOT NULL,
	`habitId` text NOT NULL,
	`completedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `habit` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`color` text NOT NULL,
	`repeatType` text NOT NULL,
	`daysOfWeek` text NOT NULL,
	`weeklyFreq` integer NOT NULL,
	`monthlyDays` text NOT NULL,
	`reminder` text
);
--> statement-breakpoint
CREATE TABLE `note` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer NOT NULL,
	`editedAt` integer NOT NULL,
	`images` text NOT NULL,
	`color` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `task` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`createdAt` integer NOT NULL,
	`targetDate` integer NOT NULL,
	`completedAt` integer,
	`reminder` integer
);
