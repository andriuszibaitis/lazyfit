-- AlterTable
ALTER TABLE `Exercise` MODIFY `imageUrl` TEXT NULL,
    MODIFY `videoUrl` TEXT NULL;

-- AlterTable
ALTER TABLE `NutritionPlan` MODIFY `imageUrl` TEXT NULL,
    MODIFY `videoUrl` TEXT NULL;

-- AlterTable
ALTER TABLE `TrainingProgram` MODIFY `imageUrl` TEXT NULL,
    MODIFY `videoUrl` TEXT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `birthDate` DATETIME(3) NULL,
    ADD COLUMN `emailNotifications` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `gender` VARCHAR(191) NULL,
    ADD COLUMN `generalNotifications` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Workout` MODIFY `imageUrl` TEXT NULL,
    MODIFY `videoUrl` TEXT NULL;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dueDate` DATETIME(3) NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'EUR',
    `status` VARCHAR(191) NOT NULL DEFAULT 'paid',
    `description` VARCHAR(191) NULL,
    `membershipName` VARCHAR(191) NULL,
    `pdfUrl` VARCHAR(191) NULL,
    `pdfKey` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Invoice_invoiceNumber_key`(`invoiceNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
