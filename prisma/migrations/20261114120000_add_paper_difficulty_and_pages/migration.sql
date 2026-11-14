-- AlterTable
ALTER TABLE "Paper" ADD COLUMN     "difficultyReason" TEXT,
ADD COLUMN     "pageCount" INTEGER,
ADD COLUMN     "pagesCheckedAt" TIMESTAMP(3),
ALTER COLUMN "difficulty" DROP NOT NULL,
ALTER COLUMN "readingTime" DROP NOT NULL;


-- The old values were placeholders (every paper 1/5) and a flat 4 minutes per
-- page; both are replaced by the new estimates as the scripts fill them in.
UPDATE "Paper" SET "difficulty" = NULL, "readingTime" = NULL;
