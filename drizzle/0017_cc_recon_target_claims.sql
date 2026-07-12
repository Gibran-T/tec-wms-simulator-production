CREATE TABLE IF NOT EXISTS `cc_recon_target_claims` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runId` int NOT NULL,
	`stepCode` varchar(32) NOT NULL DEFAULT 'CC_RECON',
	`sku` varchar(64) NOT NULL,
	`bin` varchar(64) NOT NULL,
	`idempotencyKey` varchar(191) NOT NULL,
	`varianceQty` decimal(10,2) NOT NULL,
	`status` varchar(32) NOT NULL DEFAULT 'CLAIMED',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp NULL,
	CONSTRAINT `cc_recon_target_claims_id` PRIMARY KEY(`id`),
	CONSTRAINT `cc_recon_target_claims_key_uidx` UNIQUE(`idempotencyKey`),
	CONSTRAINT `cc_recon_target_claims_run_target_uidx` UNIQUE(`runId`,`stepCode`,`sku`,`bin`)
);
