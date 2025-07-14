/*
  Warnings:

  - You are about to drop the `Problems` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `hostId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Problems" DROP CONSTRAINT "Problems_roomId_fkey";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "hostId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Problems";

-- CreateTable
CREATE TABLE "Problem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "StarterCode" TEXT NOT NULL,
    "testCases" JSONB NOT NULL,
    "roomId" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'EASY',

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserJoinedRooms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserJoinedRooms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_userMatchHistory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_userMatchHistory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Problem_slug_key" ON "Problem"("slug");

-- CreateIndex
CREATE INDEX "_UserJoinedRooms_B_index" ON "_UserJoinedRooms"("B");

-- CreateIndex
CREATE INDEX "_userMatchHistory_B_index" ON "_userMatchHistory"("B");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserJoinedRooms" ADD CONSTRAINT "_UserJoinedRooms_A_fkey" FOREIGN KEY ("A") REFERENCES "MatchParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserJoinedRooms" ADD CONSTRAINT "_UserJoinedRooms_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userMatchHistory" ADD CONSTRAINT "_userMatchHistory_A_fkey" FOREIGN KEY ("A") REFERENCES "MatchParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userMatchHistory" ADD CONSTRAINT "_userMatchHistory_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
