-- CreateEnum
CREATE TYPE "role" AS ENUM ('host', 'PARTICIPANT');

-- AlterTable
ALTER TABLE "MatchParticipant" ADD COLUMN     "role" "role" NOT NULL DEFAULT 'PARTICIPANT';
