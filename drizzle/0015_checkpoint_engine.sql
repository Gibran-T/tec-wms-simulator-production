-- Phase 1: Checkpoint engine columns on module_progress (M2–M5 pedagogical checkpoints)

ALTER TABLE `module_progress`
  ADD COLUMN `progressPct` INT NOT NULL DEFAULT 0,
  ADD COLUMN `completedScenarios` INT NOT NULL DEFAULT 0,
  ADD COLUMN `requiredScenarios` INT NOT NULL DEFAULT 3,
  ADD COLUMN `averageScore` INT NULL,
  ADD COLUMN `scenarioStatusJson` JSON NULL,
  ADD COLUMN `engineVersion` VARCHAR(16) NULL;
