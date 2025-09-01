-- DropForeignKey
ALTER TABLE `ProgramPeriod` DROP FOREIGN KEY `ProgramPeriod_programId_fkey`;

-- DropIndex
DROP INDEX `ProgramPeriod_programId_order_key` ON `ProgramPeriod`;

-- AlterTable
ALTER TABLE `ProgramPeriod` MODIFY `description` VARCHAR(191) NULL,
    ALTER COLUMN `order` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `ProgramPeriod` ADD CONSTRAINT `ProgramPeriod_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `TrainingProgram`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
