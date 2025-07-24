/*
  Warnings:

  - You are about to drop the column `MatchStartedAt` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "MatchStartedAt",
ADD COLUMN     "matchStartedAt" TIMESTAMP(3);
