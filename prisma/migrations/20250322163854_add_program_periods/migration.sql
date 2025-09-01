-- DropForeignKey
ALTER TABLE `ProgramPeriod` DROP FOREIGN KEY `ProgramPeriod_programId_fkey`;

-- DropIndex
DROP INDEX `ProgramPeriod_programId_fkey` ON `ProgramPeriod`;

-- AlterTable
ALTER TABLE `ProgramWorkout` ADD COLUMN `weekId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `PeriodWeek` (
    `id` VARCHAR(191) NOT NULL,
    `periodId` VARCHAR(191) NOT NULL,
    `weekNumber` INTEGER NOT NULL,
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `PeriodWeek_periodId_weekNumber_key`(`periodId`, `weekNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProgramPeriod` ADD CONSTRAINT `ProgramPeriod_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `TrainingProgram`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PeriodWeek` ADD CONSTRAINT `PeriodWeek_periodId_fkey` FOREIGN KEY (`periodId`) REFERENCES `ProgramPeriod`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProgramWorkout` ADD CONSTRAINT `ProgramWorkout_weekId_fkey` FOREIGN KEY (`weekId`) REFERENCES `PeriodWeek`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
