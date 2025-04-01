/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Drink` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Drink` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Drink" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Drink_name_key" ON "Drink"("name");
