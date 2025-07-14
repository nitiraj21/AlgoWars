/*
  Warnings:

  - You are about to drop the `_UserJoinedRooms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_userMatchHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserJoinedRooms" DROP CONSTRAINT "_UserJoinedRooms_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserJoinedRooms" DROP CONSTRAINT "_UserJoinedRooms_B_fkey";

-- DropForeignKey
ALTER TABLE "_userMatchHistory" DROP CONSTRAINT "_userMatchHistory_A_fkey";

-- DropForeignKey
ALTER TABLE "_userMatchHistory" DROP CONSTRAINT "_userMatchHistory_B_fkey";

-- DropTable
DROP TABLE "_UserJoinedRooms";

-- DropTable
DROP TABLE "_userMatchHistory";
