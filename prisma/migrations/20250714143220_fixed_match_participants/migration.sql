/*
  Warnings:

  - A unique constraint covering the columns `[userId,roomId]` on the table `MatchParticipant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MatchParticipant_userId_roomId_key" ON "MatchParticipant"("userId", "roomId");
