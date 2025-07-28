ALTER TABLE `users_lists` ADD `user_list_description` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `countries_id_unique` ON `countries` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);