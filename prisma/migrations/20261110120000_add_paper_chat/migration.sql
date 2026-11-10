-- CreateTable
CREATE TABLE "ChatUsage" (
    "userId" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "messages" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ChatUsage_pkey" PRIMARY KEY ("userId","day")
);
-- CreateTable
CREATE TABLE "PaperChatAnswer" (
    "paperId" TEXT NOT NULL,
    "starter" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PaperChatAnswer_pkey" PRIMARY KEY ("paperId","starter")
);
-- AddForeignKey
ALTER TABLE "ChatUsage" ADD CONSTRAINT "ChatUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "PaperChatAnswer" ADD CONSTRAINT "PaperChatAnswer_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE CASCADE ON UPDATE CASCADE;
