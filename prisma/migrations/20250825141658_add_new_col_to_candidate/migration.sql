/*
  Warnings:

  - You are about to drop the column `phone` on the `Candidate` table. All the data in the column will be lost.
  - Made the column `resumeUrl` on table `Candidate` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Candidate" DROP COLUMN "phone",
ADD COLUMN     "aiScore" INTEGER,
ADD COLUMN     "aiSummary" TEXT,
ADD COLUMN     "resumeText" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'processing',
ALTER COLUMN "resumeUrl" SET NOT NULL;
