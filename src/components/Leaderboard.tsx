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
                {/* FIX: Sort karein aur fir seedha participants array par map karein */}
                {[...participants]
                    .sort((a, b) => b.score - a.score)
                    .map((p, index) => ( 
                        <TableRow key={p.user?.username || index}>
                            <TableCell className="text-center font-medium text-slate-100 ">{index + 1}</TableCell>
                            <TableCell className="text-center font-medium text-slate-100">{p.user?.username}</TableCell>
                            <TableCell className="text-center font-bold text-slate-100">{p.score}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    );
}
