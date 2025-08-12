import React from 'react'
import { prisma } from '../lib/prisma'
import { getServerSession } from 'next-auth';
import UserIcon from 'public/Gold.svg'
import getRank from '../Functions/getRank';

export const DashBoardCard =  async () => {

    const session = await getServerSession();
    let username = ""
    if( session?.user?.name){
        username = session.user.name;
    }
    const res = await prisma.user.findUnique({
        where : {username : username},
    })
    const user = res
    if(!user){
        return (
            <div>cant fetch the data</div>
        )
    }
    const WinPercentage = Math.ceil(user.wins/ user.matches * 100);
    const Rank = getRank(user.XP);

    const stats = [
        
        { label: "Matches", value: user.matches },
        { label: "Wins", value: user.wins },
        { label: "Points", value: user.XP },
        
      ];

  return (
    <div className='flex justify-start items-center w-84   bg-[#222627] rounded-xl shadow-lg'>
        <div className='gap-4'>
            <div className='flex item-center justify-start ml-7 mb-2 text-2xl font-semibold'>{user.username}</div>
            <div className='flex justify-start'>
           {stats.map((stat)=>(
            <div
                key={stat.label}
                className='ml-6'
            >
                <div className='text-md text-gray-400'>{stat.label}</div>
                <div className='flex items-center justify-center text-lg font-semibold'>{stat.value}</div>
                
            </div>
           ))}
        </div>
        </div>
        <div className='ml-6 mt-0'>
        {Rank === "Gold" && <img className='mb-4' src="/Gold2.png" alt="Gold Rank" width={60} height={60} />}
        </div>
    </div>
  )
}
