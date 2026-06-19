-- P0: Deduplicate module_progress and enforce one row per (userId, moduleId).
-- Merge certification-relevant fields from all duplicates into the canonical survivor (MIN id).

UPDATE `module_progress` mp
INNER JOIN (
  SELECT
    `userId`,
    `moduleId`,
    MIN(`id`) AS `keepId`,
    MAX(CAST(`passed` AS UNSIGNED)) AS `passed`,
    MAX(`bestScore`) AS `bestScore`,
    MIN(CASE WHEN `passed` = 1 AND `completedAt` IS NOT NULL THEN `completedAt` END) AS `completedAt`,
    MAX(CAST(`teacherValidated` AS UNSIGNED)) AS `teacherValidated`,
    MAX(`teacherValidatedAt`) AS `teacherValidatedAt`
  FROM `module_progress`
  GROUP BY `userId`, `moduleId`
) agg ON mp.`id` = agg.`keepId`
SET
  mp.`passed` = agg.`passed`,
  mp.`bestScore` = agg.`bestScore`,
  mp.`completedAt` = agg.`completedAt`,
  mp.`teacherValidated` = agg.`teacherValidated`,
  mp.`teacherValidatedAt` = agg.`teacherValidatedAt`;
--> statement-breakpoint
DELETE mp FROM `module_progress` mp
INNER JOIN (
  SELECT `userId`, `moduleId`, MIN(`id`) AS `keepId`
  FROM `module_progress`
  GROUP BY `userId`, `moduleId`
) keep ON mp.`userId` = keep.`userId` AND mp.`moduleId` = keep.`moduleId`
WHERE mp.`id` <> keep.`keepId`;
--> statement-breakpoint
CREATE UNIQUE INDEX `module_progress_user_module_idx` ON `module_progress` (`userId`,`moduleId`);
