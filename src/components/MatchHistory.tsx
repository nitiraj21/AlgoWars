import React from 'react'
import Leaderboard from './Leaderboard'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getServerSession } from 'next-auth';
import { prisma } from '../lib/prisma';

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
            take: 10,
            select: {
              score: true, 
              joinedAt: true,
              role: true,
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
        rank: "TBD",
        date:match.joinedAt.toDateString()
      }));
  return (
    <div className='bg-[#222627] w-auto  md:w-[800px] rounded-lg overflow-hidden border border-gray-600 shadow-lg' >
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px] text-center text-slate-200 font-semibold">Room</TableHead>
                    <TableHead className="text-center text-slate-200 font-semibold">Score</TableHead>
                    <TableHead className="text-center text-slate-200 font-semibold">Rank</TableHead>
                    <TableHead className="text-center text-slate-200 font-semibold">Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows?.map((row, index) => (
                    <TableRow key={index} className='border-b border-gray-600 '>
                        <TableCell className="text-center">{row.room}</TableCell>
                        <TableCell className="text-center">{row.score}</TableCell>
                        <TableCell className="text-center">{row.rank}</TableCell>
                        <TableCell className="text-center">{row.date}</TableCell>
                    </TableRow>
                ))}
</TableBody>
        </Table>
    </div>
  )
}

export default MatchHistory