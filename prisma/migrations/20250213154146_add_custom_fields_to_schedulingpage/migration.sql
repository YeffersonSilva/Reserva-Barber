/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `SchedulingPage` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SchedulingPage" ADD COLUMN     "customCss" TEXT,
ADD COLUMN     "customJs" TEXT,
ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SchedulingPage_slug_key" ON "SchedulingPage"("slug");
