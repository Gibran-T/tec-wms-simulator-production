-- M1–M3 in-mission decision analytics (additive only).
-- Does NOT alter scenario_runs scoring engines, certification, assessments, or M4/M5.
-- Safe locally; do not run on production without explicit approval.

CREATE TABLE IF NOT EXISTS `mission_decision_responses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `runId` INT NOT NULL,
  `moduleId` INT NOT NULL,
  `scnCode` VARCHAR(16) NOT NULL,
  `stepCode` VARCHAR(32) NOT NULL,
  `questionId` VARCHAR(64) NOT NULL,
  `optionId` VARCHAR(16) NOT NULL,
  `correctOptionId` VARCHAR(16) NOT NULL,
  `isCorrect` BOOLEAN NOT NULL,
  `pointsDelta` INT NOT NULL DEFAULT 0,
  `responseMs` INT NULL,
  `submitMode` ENUM('OFFICIAL','FORMATIVE') NOT NULL DEFAULT 'OFFICIAL',
  `errorType` VARCHAR(128) NULL,
  `competence` VARCHAR(128) NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_mdr_run` (`runId`),
  KEY `idx_mdr_user` (`userId`),
  KEY `idx_mdr_module` (`moduleId`)
);
