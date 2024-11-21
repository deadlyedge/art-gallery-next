/*
  Warnings:

  - You are about to drop the column `name` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `DirectMessage` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Event` table. All the data in the column will be lost.
  - Added the required column `title` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `DirectMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "name",
DROP COLUMN "url",
ADD COLUMN     "descrition" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DirectMessage" DROP COLUMN "content",
ADD COLUMN     "text" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;
