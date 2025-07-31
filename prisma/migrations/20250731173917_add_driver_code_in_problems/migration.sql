/*
  Warnings:

  - You are about to drop the column `StarterCode` on the `Problem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "StarterCode",
ADD COLUMN     "constraints" JSONB,
ADD COLUMN     "driverCode" JSONB,
ADD COLUMN     "starterCode" JSONB,
ADD COLUMN     "tags" TEXT[],
ALTER COLUMN "testCases" DROP NOT NULL;
