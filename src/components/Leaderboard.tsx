'use client';
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Participant ke liye ek saaf-suthra type define karein
interface Participant {
  user?: {
      username?: string;
      profilePic? :string
  };
  score: number;
}

// Component ke props ke liye interface banayein
interface LeaderboardProps {
  participants: Participant[];
}

export default function Leaderboard({ participants }: LeaderboardProps) {
    // Component ko hamesha JSX return karna chahiye
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px] text-center text-slate-200">Rank</TableHead>
                    <TableHead className="text-center text-slate-200">Name</TableHead>
                    <TableHead className="text-center text-slate-200">Score</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...participants]
                    .sort((a, b) => b.score - a.score)
                    .map((p, index) => ( 
                        <TableRow key={p.user?.username || index} className='hover:bg-slate-600 cursor-pointer'>
                            <TableCell className="text-center font-medium text-slate-200 ">{index + 1}</TableCell>
                            <TableCell className="text-center font-medium text-slate-200"><img src={p.user?.profilePic}/>{p.user?.username} {index === 0 && p.score > 0 && <span>🥇</span>} {index === 1  && p.score > 0  && <span>🥈</span>} {index === 2  && p.score > 0  && <span>🥉</span>}</TableCell>
                            
                            <TableCell className="text-center font-bold text-slate-200">{p.score}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    );
}
