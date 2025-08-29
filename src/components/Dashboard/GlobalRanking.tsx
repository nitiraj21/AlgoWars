import { prisma } from '@/src/lib/prisma'
import React from 'react'
import Image from "next/image";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default async function GlobalRanking() {

  const data = await prisma.user.findMany({
    orderBy : {XP : "desc"},
    take : 10,
    select : {
      username : true,
      XP : true,
      matches : true,
      wins : true,
      ProfilePic : true

    }
  })
  return (
    <div className='bg-gray-500/15 w-auto h-auto  text-lg rounded-lg overflow-hidden border border-gray-600 shadow-lg mb-2 mr-4 flex-wrap'  >
      <div className="text-center text-2xl font-semibold text-slate-200 mb-3 mt-5">
        Global Rankings
      </div>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px] text-center text-slate-200 font-semibold text-lg">User</TableHead>
                    <TableHead className="text-center text-slate-200 font-semibold text-lg">Rank</TableHead>
                    <TableHead className="text-center text-slate-200 font-semibold text-lg">Points</TableHead>
                    <TableHead className="text-center text-slate-200 font-semibold text-lg">Wins</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.map((row, index) => (
                    <TableRow key={index} className='border-b border-gray-600 hover:bg-gray-700/30 transition'>
                        <TableCell className="text-left text-gray-200 text-lg pl-3 flex"><div className='rounded-3xl overflow-hidden'><Image 
                                            src={row.ProfilePic || "/Profile.jpeg"} 
                                            width={37} 
                                            height={37} 
                                            alt="profile"
                                        /></div><span className='ml-2 mt-1'>{row.username}</span></TableCell>
                        <TableCell className="text-center text-gray-200 text-lg">{index+1}</TableCell>
                        <TableCell className="text-center text-gray-200 text-lg">{row.XP}</TableCell>
                        <TableCell className="text-center text-gray-200 text-lg">{row.wins}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
        </Table>
    </div>
  )
}
