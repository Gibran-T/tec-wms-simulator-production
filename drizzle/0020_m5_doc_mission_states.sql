-- M5 documentary supervision — satellite persistence (additive only).
-- interactionModel = supervision-doc-v1 · evidenceVersion = m5-session-v2
-- Does NOT touch scenario_runs rows, ops-ledger evidence, replenishment, inventory,
-- kpi_snapshots pedagogical truth, module_progress, or legacy Gold gates.
-- Safe to apply locally; do NOT run on production without explicit approval.
-- Empty at creation — no data backfill / no reinterpretation of existing runs.

CREATE TABLE IF NOT EXISTS `m5_doc_mission_states` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `runId` INT NOT NULL,
  `version` VARCHAR(32) NOT NULL,
  `stateJson` JSON NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `m5_doc_mission_states_run_version_uidx` (`runId`, `version`),
  KEY `idx_m5_doc_mission_states_run` (`runId`),
  CONSTRAINT `fk_m5_doc_mission_states_run`
    FOREIGN KEY (`runId`) REFERENCES `scenario_runs` (`id`)
    ON DELETE CASCADE
);
