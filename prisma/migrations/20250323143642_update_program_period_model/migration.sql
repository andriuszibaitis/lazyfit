-- AlterTable
ALTER TABLE `Workout` ADD COLUMN `originalWorkoutId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Workout` ADD CONSTRAINT `Workout_originalWorkoutId_fkey` FOREIGN KEY (`originalWorkoutId`) REFERENCES `Workout`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
