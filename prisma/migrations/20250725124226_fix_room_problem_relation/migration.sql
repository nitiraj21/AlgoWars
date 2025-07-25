-- DropForeignKey
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_roomId_fkey";

-- CreateTable
CREATE TABLE "_ProblemToRoom" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProblemToRoom_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProblemToRoom_B_index" ON "_ProblemToRoom"("B");

-- AddForeignKey
ALTER TABLE "_ProblemToRoom" ADD CONSTRAINT "_ProblemToRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemToRoom" ADD CONSTRAINT "_ProblemToRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
