-- AlterTable
ALTER TABLE `ProgramWorkout` ADD COLUMN `periodId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ProgramPeriod` (
    `id` VARCHAR(191) NOT NULL,
    `programId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `durationWeeks` INTEGER NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `ProgramPeriod_programId_order_key`(`programId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProgramPeriod` ADD CONSTRAINT `ProgramPeriod_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `TrainingProgram`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProgramWorkout` ADD CONSTRAINT `ProgramWorkout_periodId_fkey` FOREIGN KEY (`periodId`) REFERENCES `ProgramPeriod`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
