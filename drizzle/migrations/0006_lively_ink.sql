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
