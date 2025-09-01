-- AlterTable
ALTER TABLE `FoodProduct` ADD COLUMN `isUserCreated` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `FoodProduct` ADD CONSTRAINT `FoodProduct_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
