ALTER TABLE `countries` ADD `stationcount` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `genres` ADD `stationcount` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `radios` ADD `click_count` integer;--> statement-breakpoint
ALTER TABLE `radios` ADD `votes` integer;--> statement-breakpoint
ALTER TABLE `radios` ADD `language` text;