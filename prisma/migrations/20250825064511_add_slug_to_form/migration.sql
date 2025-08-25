/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Form` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Form" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Form_slug_key" ON "public"."Form"("slug");
