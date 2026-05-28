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
ALTER TABLE `module_progress` ADD `teacherValidated` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `module_progress` ADD `teacherValidatedAt` timestamp;