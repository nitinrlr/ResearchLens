-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "treeId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Goal_userId_treeId_key" ON "Goal"("userId", "treeId");
