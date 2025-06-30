CREATE TABLE `countries` (
	`id` text PRIMARY KEY NOT NULL,
	`country_name` text NOT NULL,
	`iso_3166_1` text NOT NULL,
	`is_deleted` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `countries_iso_3166_1_unique` ON `countries` (`iso_3166_1`);--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `radios` (
	`id` text PRIMARY KEY NOT NULL,
	`radio_name` text NOT NULL,
	`url` text NOT NULL,
	`favicon` text,
	`country_id` text,
	`radio_tags` text DEFAULT '[]',
	`radio_language` text DEFAULT '[]',
	`is_deleted` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`user_name` text,
	`avatar` text,
	`is_deleted` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `users_lists` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`user_list_name` text NOT NULL,
	`is_deleted` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users_lists_radios` (
	`id` text PRIMARY KEY NOT NULL,
	`user_list_id` text NOT NULL,
	`radio_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_list_id`) REFERENCES `users_lists`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`radio_id`) REFERENCES `radios`(`id`) ON UPDATE no action ON DELETE no action
);
