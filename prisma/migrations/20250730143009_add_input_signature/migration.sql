/*
  Warnings:

  - You are about to drop the column `imputSignature` on the `Problem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "imputSignature",
ADD COLUMN     "inputSignature" JSONB;
