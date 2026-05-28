CREATE TABLE `bin_capacity` (
	`id` int AUTO_INCREMENT NOT NULL,
	`binCode` varchar(64) NOT NULL,
	`maxCapacity` int NOT NULL DEFAULT 500,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bin_capacity_id` PRIMARY KEY(`id`),
	CONSTRAINT `bin_capacity_binCode_unique` UNIQUE(`binCode`)
);
--> statement-breakpoint
CREATE TABLE `module_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` int NOT NULL,
	`passed` boolean NOT NULL DEFAULT false,
	`bestScore` int NOT NULL DEFAULT 0,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `module_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `putaway_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runId` int NOT NULL,
	`sku` varchar(64) NOT NULL,
	`fromBin` varchar(64) NOT NULL,
	`toBin` varchar(64) NOT NULL,
	`qty` int NOT NULL,
	`lotNumber` varchar(64),
	`receivedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `putaway_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `docType` enum('PO','GR','SO','GI','ADJ','PUTAWAY') NOT NULL;--> statement-breakpoint
ALTER TABLE `modules` ADD `order` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `modules` ADD `unlockedByModuleId` int;