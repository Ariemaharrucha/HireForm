/*
  Warnings:

  - Made the column `slug` on table `Form` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Form" ALTER COLUMN "slug" SET NOT NULL;
