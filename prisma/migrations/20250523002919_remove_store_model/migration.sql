/*
  Warnings:

  - You are about to drop the column `storeId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Store` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_storeId_fkey";

-- AlterTable
ALTER TABLE "Shift" ALTER COLUMN "endTime" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "storeId";

-- DropTable
DROP TABLE "Store";
