-- Goals now follow a skill tree (src/lib/skill-trees), so the topic links,
-- description and status from the first design were never used. All were empty.

-- DropForeignKey
ALTER TABLE "GoalTopic" DROP CONSTRAINT "GoalTopic_goalId_fkey";

-- DropForeignKey
ALTER TABLE "GoalTopic" DROP CONSTRAINT "GoalTopic_topicId_fkey";

-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "description",
DROP COLUMN "status",
ALTER COLUMN "treeId" SET NOT NULL;

-- DropTable
DROP TABLE "GoalTopic";

-- DropEnum
DROP TYPE "GoalStatus";

