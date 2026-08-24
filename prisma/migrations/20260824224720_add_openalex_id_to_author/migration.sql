/*
  Warnings:

  - A unique constraint covering the columns `[openAlexId]` on the table `Author` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `openAlexId` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "openAlexId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Author_openAlexId_key" ON "Author"("openAlexId");
