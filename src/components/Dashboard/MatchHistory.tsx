import React from 'react'
import Leaderboard from '../Leaderboard'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getServerSession } from 'next-auth';
import { prisma } from '../../lib/prisma';

async function MatchHistory() {

    const session = await getServerSession();
    let username = ""
    if( session?.user?.name){
        username = session.user.name;
    }

    const data = await prisma.user.findUnique({
        where: { username },
        select: {
          username: true,
          matchHistory: {
            orderBy: { joinedAt: "desc" },
            take: 12,
            select: {
              score: true, 
              joinedAt: true,
              role: true,
              rank : true,
              room: {
                select: {
                  id: true,
                  name: true,
                  createdAt: true,
                  status: true,
                },
              },
            },
          },
        },
      });

      const rows = data?.matchHistory.map(match => ({
        room: match.room.name,
        score: match.score,
        rank: match.rank,
        date:match.joinedAt.toDateString()
      }));
  return (
    <div className='bg-gray-500/15 w-auto  text-lg rounded-lg overflow-hidden border border-gray-600 shadow-lg mb-4' >
        <div className="text-center text-2xl font-semibold text-slate-200 mb-2 mt-4">
          Match History
        </div>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px] text-center text-slate-200 font-semibold text-lg">Room</TableHead>
                    <TableHead className="text-center text-slate-200 font-semibold text-lg">Score</TableHead>
                    <TableHead className="text-center text-slate-200 font-semibold text-lg">Rank</TableHead>
                    <TableHead className="text-center text-slate-200 font-semibold text-lg">Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows?.map((row, index) => (
                    <TableRow key={index} className='border-b border-gray-600 hover:bg-gray-700/30 transition'>
                        <TableCell className="text-center text-gray-200 text-lg">{row.room}</TableCell>
                        <TableCell className="text-center text-gray-200 text-lg">{row.score}</TableCell>
                        <TableCell className="text-center text-gray-200 text-lg">{row.rank}</TableCell>
                        <TableCell className="text-center text-gray-200 text-lg">{row.date}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
        </Table>
    </div>
  )
}

export default MatchHistory