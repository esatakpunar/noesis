-- CreateEnum
CREATE TYPE "TopicCategory" AS ENUM ('diksiyon', 'psikoloji', 'felsefe', 'bilim', 'nadir', 'etimoloji', 'sanat');

-- CreateEnum
CREATE TYPE "TopicDifficulty" AS ENUM ('kolay', 'orta', 'zor');

-- CreateEnum
CREATE TYPE "TopicSource" AS ENUM ('seed', 'ai', 'user');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "streakCount" INTEGER NOT NULL DEFAULT 0,
    "streakLastDate" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "TopicCategory" NOT NULL,
    "difficulty" "TopicDifficulty" NOT NULL,
    "pronunciation" TEXT,
    "origin" TEXT,
    "researchPrompts" TEXT[],
    "source" "TopicSource" NOT NULL DEFAULT 'seed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "shownAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopicHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodexEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "notes" TEXT,
    "wpm" INTEGER,
    "fillerWordCount" INTEGER,
    "clarityScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodexEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_title_key" ON "Topic"("title");

-- CreateIndex
CREATE INDEX "Topic_category_difficulty_idx" ON "Topic"("category", "difficulty");

-- CreateIndex
CREATE INDEX "TopicHistory_userId_shownAt_idx" ON "TopicHistory"("userId", "shownAt");

-- CreateIndex
CREATE INDEX "CodexEntry_userId_createdAt_idx" ON "CodexEntry"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "TopicHistory" ADD CONSTRAINT "TopicHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicHistory" ADD CONSTRAINT "TopicHistory_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodexEntry" ADD CONSTRAINT "CodexEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodexEntry" ADD CONSTRAINT "CodexEntry_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
