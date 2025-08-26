CREATE TABLE `radio_listening_counts` (
	`id` text PRIMARY KEY NOT NULL,
	`radio_id` text NOT NULL,
	`click_count` integer DEFAULT 0 NOT NULL,
	`last_updated` text DEFAULT CURRENT_TIMESTAMP,
	`needs_update` integer GENERATED ALWAYS AS (CASE WHEN julianday('now') - julianday(last_updated) >= (2.0/24.0) THEN 1 ELSE 0 END) VIRTUAL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`radio_id`) REFERENCES `radios`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `radio_listening_counts_radio_id_unique` ON `radio_listening_counts` (`radio_id`);