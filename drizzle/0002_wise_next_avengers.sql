CREATE TABLE `certifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`credentialId` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`certType` enum('m1_fundamentals','m2m5_integrated') NOT NULL,
	`studentName` varchar(255) NOT NULL,
	`studentEmail` varchar(320) NOT NULL,
	`finalScore` int NOT NULL,
	`modulesCompleted` json NOT NULL,
	`competencies` json NOT NULL,
	`issuedAt` timestamp NOT NULL DEFAULT (now()),
	`revokedAt` timestamp,
	`verificationHash` varchar(128) NOT NULL,
	CONSTRAINT `certifications_id` PRIMARY KEY(`id`),
	CONSTRAINT `certifications_credentialId_unique` UNIQUE(`credentialId`)
);
