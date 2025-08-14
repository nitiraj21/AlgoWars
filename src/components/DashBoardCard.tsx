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
    const Rank = getRank(user.XP);

    const stats = [
        
        { label: "Matches", value: user.matches },
        { label: "Wins", value: user.wins },
        { label: "Points", value: user.XP },
        
      ];

  return (
    <div className='flex justify-start items-center w-full   bg-[#222627] rounded-xl shadow-xl'>
        <div className='gap-5'>
            <div className='flex justify-start items-center ml-6'>
                <div className='rounded-3xl overflow-hidden'><img  src={"./Profile.jpeg"} width={50} height={50}/></div>
                <div className='flex item-center justify-start ml-2 mb-2 text-2xl font-semibold'>@{user.username}</div>
            </div>
            <div className='flex justify-start mt-2'>
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
        {Rank === "Silver" && <img className='mb-10' src="/Silver.png" alt="Gold Rank" width={65} height={65} />}
        {Rank === "Bronze" && <img className='mb-10' src="/Bronze.png" alt="Gold Rank" width={65} height={65} />}
        {Rank === "Platinum" && <img className='mb-10' src="/Platinum.png" alt="Gold Rank" width={65} height={65} />}
        {Rank === "Gold" && <img className='mb-10' src="/Gold2.png" alt="Gold Rank" width={65} height={65} />}
        {Rank === "Legend" && <img className='mb-10' src="/Legend2.png" alt="Gold Rank" width={65} height={65} />}
        </div>
    </div>
  )
}
