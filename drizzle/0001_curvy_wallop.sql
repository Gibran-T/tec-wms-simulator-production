CREATE TABLE `assignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`scenarioId` int NOT NULL,
	`cohortId` int,
	`userId` int,
	`isActive` boolean NOT NULL DEFAULT true,
	`dueDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cohorts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cohorts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cycle_counts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runId` int NOT NULL,
	`sku` varchar(64) NOT NULL,
	`bin` varchar(64) NOT NULL,
	`systemQty` decimal(10,2) NOT NULL,
	`physicalQty` decimal(10,2) NOT NULL,
	`variance` decimal(10,2) NOT NULL,
	`resolved` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cycle_counts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `master_bins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`binCode` varchar(64) NOT NULL,
	`description` varchar(255),
	`zone` enum('RECEPTION','PICKING','STOCKAGE','RESERVE','EXPEDITION') DEFAULT 'STOCKAGE',
	`maxCapacity` int DEFAULT 500,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `master_bins_id` PRIMARY KEY(`id`),
	CONSTRAINT `master_bins_binCode_unique` UNIQUE(`binCode`)
);
--> statement-breakpoint
CREATE TABLE `master_skus` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sku` varchar(64) NOT NULL,
	`descriptionFr` varchar(255) NOT NULL,
	`descriptionEn` varchar(255),
	`unitOfMeasure` varchar(32) DEFAULT 'UN',
	`maxCapacity` int DEFAULT 1000,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `master_skus_id` PRIMARY KEY(`id`),
	CONSTRAINT `master_skus_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`titleFr` varchar(255) NOT NULL,
	`titleEn` varchar(255) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`stepsJson` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `modules_id` PRIMARY KEY(`id`),
	CONSTRAINT `modules_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`cohortId` int,
	`studentNumber` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `profiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runId` int NOT NULL,
	`stepCode` varchar(32) NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp,
	CONSTRAINT `progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scenario_runs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`scenarioId` int NOT NULL,
	`status` enum('in_progress','completed','abandoned') NOT NULL DEFAULT 'in_progress',
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `scenario_runs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scenarios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`descriptionFr` text,
	`difficulty` enum('facile','moyen','difficile') DEFAULT 'moyen',
	`initialStateJson` json,
	`createdBy` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scenarios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scoring_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runId` int NOT NULL,
	`eventType` varchar(64) NOT NULL,
	`pointsDelta` int NOT NULL,
	`message` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scoring_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runId` int NOT NULL,
	`docType` enum('PO','GR','SO','GI','ADJ') NOT NULL,
	`moveType` varchar(16),
	`sku` varchar(64) NOT NULL,
	`bin` varchar(64) NOT NULL,
	`qty` decimal(10,2) NOT NULL,
	`posted` boolean NOT NULL DEFAULT false,
	`docRef` varchar(64),
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','student','teacher') NOT NULL DEFAULT 'student';