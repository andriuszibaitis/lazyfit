/*
  Warnings:

  - You are about to drop the column `durationWeeks` on the `ProgramPeriod` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ProgramPeriod` DROP COLUMN `durationWeeks`,
    ADD COLUMN `endWeek` INTEGER NOT NULL DEFAULT 4,
    ADD COLUMN `startWeek` INTEGER NOT NULL DEFAULT 1;
