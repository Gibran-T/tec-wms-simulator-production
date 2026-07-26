-- Formative exercises M4/M5 — isolated persistence (additive only).
-- Does NOT touch scenario_runs, module_progress, scoring_events, quiz_attempts,
-- assessments, certification, or official cohort analytics.
-- Safe to apply locally; do not run on production without explicit approval.
--
-- Re-execution model (approved): one active row per (userId, exerciseId, version).
-- Restart / leave-and-reenter UPDATEs the same row (clears answers, status in_progress).
-- No multi-attempt history table in this wave.

CREATE TABLE IF NOT EXISTS `formative_exercise_attempts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `exerciseId` VARCHAR(64) NOT NULL,
  `moduleId` INT NOT NULL,
  `version` INT NOT NULL DEFAULT 1,
  `answers` JSON NOT NULL,
  `formativeScore` INT NULL,
  `status` ENUM('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
  `feedbackJson` JSON NULL,
  `countsTowardMissionCount` BOOLEAN NOT NULL DEFAULT FALSE,
  `countsTowardScenarioAverage` BOOLEAN NOT NULL DEFAULT FALSE,
  `countsTowardCertificate` BOOLEAN NOT NULL DEFAULT FALSE,
  `countsTowardAssessment` BOOLEAN NOT NULL DEFAULT FALSE,
  `countsTowardCheckpoint` BOOLEAN NOT NULL DEFAULT FALSE,
  `startedAt` TIMESTAMP NULL,
  `completedAt` TIMESTAMP NULL,
  `lastUpdatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_formative_user_exercise_version` (`userId`, `exerciseId`, `version`),
  KEY `idx_formative_user` (`userId`),
  KEY `idx_formative_module` (`moduleId`),
  KEY `idx_formative_exercise` (`exerciseId`)
);
