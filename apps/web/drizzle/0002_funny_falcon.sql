PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users_lists` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`user_list_name` text NOT NULL,
	`user_list_description` text,
	`is_deleted` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_users_lists`("id", "user_id", "user_list_name", "user_list_description", "is_deleted", "created_at") SELECT "id", "user_id", "user_list_name", "user_list_description", "is_deleted", "created_at" FROM `users_lists`;--> statement-breakpoint
DROP TABLE `users_lists`;--> statement-breakpoint
ALTER TABLE `__new_users_lists` RENAME TO `users_lists`;--> statement-breakpoint
PRAGMA foreign_keys=ON;