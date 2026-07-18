-- Integrated assessments (Évaluation intégrée 1 & 2), releases, attempts, audit
-- Safe additive migration — no destructive resets.

CREATE TABLE IF NOT EXISTS `integrated_assessments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(64) NOT NULL,
  `titleFr` VARCHAR(255) NOT NULL,
  `titleEn` VARCHAR(255) NOT NULL,
  `modulesCovered` JSON NOT NULL,
  `questionCount` INT NOT NULL DEFAULT 20,
  `durationMinutes` INT NOT NULL DEFAULT 40,
  `passingScore` INT NOT NULL DEFAULT 70,
  `totalPoints` INT NOT NULL DEFAULT 100,
  `purposeFr` TEXT NOT NULL,
  `purposeEn` TEXT NOT NULL,
  `status` ENUM('draft','ready','retired') NOT NULL DEFAULT 'draft',
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_integrated_assessments_code` (`code`)
);

CREATE TABLE IF NOT EXISTS `assessment_questions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `assessmentId` INT NOT NULL,
  `code` VARCHAR(64) NOT NULL,
  `moduleCode` VARCHAR(8) NOT NULL,
  `scenarioOrProcess` VARCHAR(128) NOT NULL,
  `competency` VARCHAR(128) NOT NULL,
  `difficulty` ENUM('easy','medium','hard') NOT NULL DEFAULT 'medium',
  `questionType` ENUM('conceptual','scenario','sequencing','data_interpretation','diagnosis') NOT NULL,
  `promptFr` TEXT NOT NULL,
  `promptEn` TEXT NOT NULL,
  `optionsJson` JSON NOT NULL,
  `correctOptionId` VARCHAR(32) NOT NULL,
  `explanationFr` TEXT NOT NULL,
  `explanationEn` TEXT NOT NULL,
  `learningObjectiveFr` TEXT NULL,
  `learningObjectiveEn` TEXT NULL,
  `estimatedTimeSeconds` INT NOT NULL DEFAULT 120,
  `avgSuccessRate` DECIMAL(5,4) NULL,
  `avgResponseTimeMs` INT NULL,
  `lastRevisedAt` TIMESTAMP NULL,
  `points` INT NOT NULL DEFAULT 5,
  `orderIndex` INT NOT NULL DEFAULT 0,
  `active` BOOLEAN NOT NULL DEFAULT TRUE,
  `annulled` BOOLEAN NOT NULL DEFAULT FALSE,
  `bankScope` VARCHAR(32) NOT NULL DEFAULT 'WMS',
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_assessment_questions_code` (`assessmentId`, `code`),
  KEY `idx_assessment_questions_assessment` (`assessmentId`),
  KEY `idx_assessment_questions_bank` (`bankScope`, `active`)
);

CREATE TABLE IF NOT EXISTS `assessment_releases` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `assessmentId` INT NOT NULL,
  `cohortId` INT NULL,
  `releaseLevel` ENUM(
    'unpublished',
    'visible_pending',
    'released_cohort',
    'released_students',
    'scheduled',
    'closed',
    'cancelled'
  ) NOT NULL DEFAULT 'unpublished',
  `studentUserIds` JSON NULL,
  `opensAt` TIMESTAMP NULL,
  `closesAt` TIMESTAMP NULL,
  `releasedByUserId` INT NULL,
  `configJson` JSON NULL,
  `note` TEXT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_assessment_releases_assessment` (`assessmentId`),
  KEY `idx_assessment_releases_cohort` (`cohortId`)
);

CREATE TABLE IF NOT EXISTS `assessment_release_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `releaseId` INT NOT NULL,
  `assessmentId` INT NOT NULL,
  `actorUserId` INT NOT NULL,
  `action` VARCHAR(64) NOT NULL,
  `beforeJson` JSON NULL,
  `afterJson` JSON NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_assessment_release_logs_release` (`releaseId`)
);

CREATE TABLE IF NOT EXISTS `assessment_attempts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `assessmentId` INT NOT NULL,
  `userId` INT NOT NULL,
  `cohortId` INT NULL,
  `attemptNumber` INT NOT NULL DEFAULT 1,
  `status` ENUM(
    'in_progress',
    'submitted',
    'expired_submitted',
    'cancelled',
    'annulled_technical'
  ) NOT NULL DEFAULT 'in_progress',
  `authorizedByUserId` INT NULL,
  `startedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expiresAt` TIMESTAMP NOT NULL,
  `submittedAt` TIMESTAMP NULL,
  `durationSeconds` INT NULL,
  `questionOrderJson` JSON NOT NULL,
  `optionOrderJson` JSON NOT NULL,
  `responsesJson` JSON NULL,
  `autoScore` INT NULL,
  `finalScore` INT NULL,
  `passed` BOOLEAN NULL,
  `competencyBreakdownJson` JSON NULL,
  `warn30Sent` BOOLEAN NOT NULL DEFAULT FALSE,
  `warn35Sent` BOOLEAN NOT NULL DEFAULT FALSE,
  `m4UnlockStatus` ENUM('locked','pending_practical','unlocked') NOT NULL DEFAULT 'locked',
  `practicalValidationStatus` ENUM(
    'not_applicable',
    'pending',
    'satisfied',
    'waived'
  ) NOT NULL DEFAULT 'pending',
  `professorReviewStatus` ENUM('none','pending','confirmed','adjusted') NOT NULL DEFAULT 'none',
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_assessment_attempts_user_number` (`assessmentId`, `userId`, `attemptNumber`),
  KEY `idx_assessment_attempts_user` (`userId`),
  KEY `idx_assessment_attempts_status` (`status`)
);

CREATE TABLE IF NOT EXISTS `assessment_attempt_responses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `attemptId` INT NOT NULL,
  `questionId` INT NOT NULL,
  `selectedOptionId` VARCHAR(32) NULL,
  `isCorrect` BOOLEAN NULL,
  `pointsAwarded` INT NULL,
  `flagged` BOOLEAN NOT NULL DEFAULT FALSE,
  `annulled` BOOLEAN NOT NULL DEFAULT FALSE,
  `professorComment` TEXT NULL,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_attempt_question` (`attemptId`, `questionId`),
  KEY `idx_assessment_attempt_responses_attempt` (`attemptId`)
);

CREATE TABLE IF NOT EXISTS `assessment_retake_authorizations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `assessmentId` INT NOT NULL,
  `userId` INT NOT NULL,
  `authorizedByUserId` INT NOT NULL,
  `opensAt` TIMESTAMP NULL,
  `closesAt` TIMESTAMP NULL,
  `note` TEXT NULL,
  `consumedAttemptId` INT NULL,
  `active` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_retake_auth_user` (`assessmentId`, `userId`, `active`)
);

CREATE TABLE IF NOT EXISTS `assessment_grade_audits` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `attemptId` INT NOT NULL,
  `actorUserId` INT NOT NULL,
  `previousScore` INT NULL,
  `updatedScore` INT NULL,
  `reason` TEXT NOT NULL,
  `detailsJson` JSON NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_grade_audits_attempt` (`attemptId`)
);

CREATE TABLE IF NOT EXISTS `assessment_practical_evidence` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `assessmentId` INT NOT NULL,
  `userId` INT NOT NULL,
  `cohortId` INT NULL,
  `taskFr` VARCHAR(255) NOT NULL,
  `resultFr` VARCHAR(255) NOT NULL,
  `note` TEXT NULL,
  `recordedByUserId` INT NOT NULL,
  `recordedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_practical_evidence_user` (`assessmentId`, `userId`)
);

CREATE TABLE IF NOT EXISTS `student_assessment_progress` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `assessmentId` INT NOT NULL,
  `bestScore` INT NULL,
  `latestScore` INT NULL,
  `firstScore` INT NULL,
  `attemptCount` INT NOT NULL DEFAULT 0,
  `passed` BOOLEAN NOT NULL DEFAULT FALSE,
  `m4UnlockStatus` ENUM('locked','pending_practical','unlocked') NOT NULL DEFAULT 'locked',
  `practicalValidationStatus` ENUM(
    'not_applicable',
    'pending',
    'satisfied',
    'waived'
  ) NOT NULL DEFAULT 'pending',
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_student_assessment_progress` (`userId`, `assessmentId`)
);

-- Quiz integrity: stable option IDs (additive; legacy correctIndex retained)
ALTER TABLE `quiz_questions`
  ADD COLUMN `optionsPayload` JSON NULL,
  ADD COLUMN `correctOptionId` VARCHAR(32) NULL;
