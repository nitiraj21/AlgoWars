/*
  Warnings:

  - You are about to drop the column `roomId` on the `Problem` table. All the data in the column will be lost.
  - The `StarterCode` column on the `Problem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "roomId",
ADD COLUMN     "functionName" TEXT,
DROP COLUMN "StarterCode",
ADD COLUMN     "StarterCode" JSONB;
