/*
  Warnings:

  - You are about to drop the column `matchStartedAt` on the `Room` table. All the data in the column will be lost.
  - Made the column `constraints` on table `Problem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Problem" ALTER COLUMN "constraints" SET NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "matchStartedAt",
ADD COLUMN     "matchEndedAt" TIMESTAMP(3);
