/*
  Warnings:

  - You are about to drop the column `descrition` on the `Content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "descrition",
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "description" TEXT;
