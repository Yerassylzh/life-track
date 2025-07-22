ALTER TABLE `note` RENAME COLUMN "content" TO "plainContent";--> statement-breakpoint
ALTER TABLE `note` ADD `richContent` text NOT NULL;