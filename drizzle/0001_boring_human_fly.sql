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
CREATE TABLE `bin_capacity` (
	`id` int AUTO_INCREMENT NOT NULL,
	`binCode` varchar(64) NOT NULL,
	`maxCapacity` int NOT NULL DEFAULT 500,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bin_capacity_id` PRIMARY KEY(`id`),
	CONSTRAINT `bin_capacity_binCode_unique` UNIQUE(`binCode`)
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
CREATE TABLE `inventory_adjustments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runId` int NOT NULL,
	`sku` varchar(64) NOT NULL,
	`varianceQty` decimal(10,2) NOT NULL,
	`adjustmentQty` decimal(10,2) NOT NULL,
	`reason` text,
	`approved` boolean NOT NULL DEFAULT false,
	`approvedBy` int,
	`approvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inventory_adjustments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventory_counts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runId` int NOT NULL,
	`sku` varchar(64) NOT NULL,
	`systemQty` decimal(10,2) NOT NULL,
	`countedQty` decimal(10,2) NOT NULL,
	`varianceQty` decimal(10,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inventory_counts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kpi_interpretations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runId` int NOT NULL,
	`kpiKey` varchar(64) NOT NULL,
	`studentAnswer` text NOT NULL,
	`isCorrect` boolean,
	`pointsDelta` int NOT NULL DEFAULT 0,
	`feedback` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `kpi_interpretations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kpi_snapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runId` int NOT NULL,
	`rotationRate` decimal(10,4),
	`serviceLevel` decimal(5,4),
	`errorRate` decimal(5,4),
	`averageLeadTime` decimal(10,2),
	`stockImmobilizedValue` decimal(14,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `kpi_snapshots_id` PRIMARY KEY(`id`)
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
CREATE TABLE `module_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` int NOT NULL,
	`passed` boolean NOT NULL DEFAULT false,
	`bestScore` int NOT NULL DEFAULT 0,
	`completedAt` timestamp,
	`teacherValidated` boolean NOT NULL DEFAULT false,
	`teacherValidatedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `module_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`titleFr` varchar(255) NOT NULL,
	`titleEn` varchar(255) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`stepsJson` json,
	`order` int NOT NULL DEFAULT 1,
	`unlockedByModuleId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `modules_id` PRIMARY KEY(`id`),
	CONSTRAINT `modules_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `password_reset_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`token` varchar(128) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`usedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `password_reset_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `password_reset_tokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `pre_authorized_emails` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`role` enum('user','admin','student','teacher') NOT NULL DEFAULT 'teacher',
	`note` varchar(255),
	`addedBy` int,
	`usedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pre_authorized_emails_id` PRIMARY KEY(`id`),
	CONSTRAINT `pre_authorized_emails_email_unique` UNIQUE(`email`)
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
CREATE TABLE `quiz_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`quizId` int NOT NULL,
	`moduleId` int NOT NULL,
	`answers` json NOT NULL,
	`score` int NOT NULL,
	`passed` boolean NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quizId` int NOT NULL,
	`questionFr` text NOT NULL,
	`questionEn` text NOT NULL,
	`optionsFr` json NOT NULL,
	`optionsEn` json NOT NULL,
	`correctIndex` int NOT NULL,
	`explanationFr` text NOT NULL,
	`explanationEn` text NOT NULL,
	`difficulty` enum('easy','medium','hard') NOT NULL DEFAULT 'medium',
	`orderIndex` int NOT NULL DEFAULT 0,
	CONSTRAINT `quiz_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizzes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleId` int NOT NULL,
	`titleFr` varchar(255) NOT NULL,
	`titleEn` varchar(255) NOT NULL,
	`passingScore` int NOT NULL DEFAULT 60,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quizzes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `replenishment_params` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sku` varchar(64) NOT NULL,
	`minQty` decimal(10,2) NOT NULL,
	`maxQty` decimal(10,2) NOT NULL,
	`safetyStock` decimal(10,2) NOT NULL,
	`leadTimeDays` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `replenishment_params_id` PRIMARY KEY(`id`),
	CONSTRAINT `replenishment_params_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `replenishment_suggestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runId` int NOT NULL,
	`sku` varchar(64) NOT NULL,
	`systemQty` decimal(10,2) NOT NULL,
	`suggestedQty` decimal(10,2) NOT NULL,
	`reason` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `replenishment_suggestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scenario_runs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`scenarioId` int NOT NULL,
	`status` enum('in_progress','completed','abandoned') NOT NULL DEFAULT 'in_progress',
	`isDemo` boolean NOT NULL DEFAULT false,
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
	`descriptionEn` text,
	`difficulty` enum('facile','moyen','difficile') DEFAULT 'moyen',
	`initialStateJson` json,
	`createdBy` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scenarios_id` PRIMARY KEY(`id`),
	CONSTRAINT `scenarios_name_module_idx` UNIQUE(`name`,`moduleId`)
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
	`docType` enum('PO','GR','SO','GI','ADJ','PUTAWAY','PUTAWAY_M1','PICKING','PICKING_M1') NOT NULL,
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
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','student','teacher') NOT NULL DEFAULT 'student';--> statement-breakpoint
ALTER TABLE `users` ADD `passwordHash` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `isActive` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `notes` text;