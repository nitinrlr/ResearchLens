-- Prisma generated a DROP TABLE + CREATE TABLE for the SavedPaper -> ReadingHistory
-- change, which would throw away every row. This migration was rewritten by hand
-- to rename the table in place instead, then backfill the new default collections.

-- 1. Rename SavedPaper to ReadingHistory, keeping its rows, keys and indexes.
ALTER TABLE "SavedPaper" RENAME TO "ReadingHistory";
ALTER TABLE "ReadingHistory" RENAME COLUMN "savedAt" TO "firstReadAt";
ALTER TABLE "ReadingHistory" RENAME CONSTRAINT "SavedPaper_pkey" TO "ReadingHistory_pkey";
ALTER TABLE "ReadingHistory" RENAME CONSTRAINT "SavedPaper_userId_fkey" TO "ReadingHistory_userId_fkey";
ALTER TABLE "ReadingHistory" RENAME CONSTRAINT "SavedPaper_paperId_fkey" TO "ReadingHistory_paperId_fkey";

-- 2. Track the most recent visit so "Continue Reading" can sort by it.
ALTER TABLE "ReadingHistory" ADD COLUMN "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
UPDATE "ReadingHistory" SET "lastReadAt" = "firstReadAt";

-- A row now means "this paper was opened", so READING is the sensible default.
ALTER TABLE "ReadingHistory" ALTER COLUMN "readingStatus" SET DEFAULT 'READING';

CREATE INDEX "ReadingHistory_userId_lastReadAt_idx" ON "ReadingHistory"("userId", "lastReadAt");

-- 3. Saving a paper now means adding it to a collection.
ALTER TABLE "Collection" ADD COLUMN "isDefault" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "Collection_userId_idx" ON "Collection"("userId");

-- 4. Give every existing user the default "Saved" collection that new sign-ups
--    now get at registration.
INSERT INTO "Collection" ("id", "userId", "title", "description", "isDefault", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, u."id", 'Saved', 'Papers you bookmarked for later.', true, NOW(), NOW()
FROM "User" u
WHERE NOT EXISTS (
    SELECT 1 FROM "Collection" c WHERE c."userId" = u."id" AND c."isDefault"
);

-- 5. Move every existing save into its owner's default collection.
INSERT INTO "CollectionPaper" ("collectionId", "paperId")
SELECT c."id", rh."paperId"
FROM "ReadingHistory" rh
JOIN "Collection" c ON c."userId" = rh."userId" AND c."isDefault"
ON CONFLICT DO NOTHING;

-- 6. Those rows recorded a save, not a visit. Now that they live in the Saved
--    collection, clear them so "Continue Reading" only lists papers actually opened.
DELETE FROM "ReadingHistory";
