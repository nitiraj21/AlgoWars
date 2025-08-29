"use client"
import React from 'react'
import Button from '../button'
import { useRouter } from 'next/navigation'

export default function CTA() {
    const router = useRouter();
  return (
    <div className='z-50 mb-20 bg-black/80 mx-10 md:mx-30 lg:mx-50 xl:mx-120 transform hover:scale-103 transition-transform duration-400 ease-in-out min-w-[100px] overflow-hidden
         bg-gradient-to-r from-gray-700/15 to-gray-500/15 backdrop-blur-lg flex flex-col items-center justify-center
         border-2 border-slate-600 cursor-pointer rounded-2xl py-6 mb-10 z-50 hover:shadow-[0_0_40px_10px_rgba(80,120,200,0.2)]'>
        <div className='text-2xl md:text-5xl mt-4 mb-5 font-xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400'>
            <h1>Start the Battle now</h1>
        </div>
        <div className='mb-7'>
            <h3 className='relative mb-2 z-10 text-xl md:text-3xl  text-center bg-clip-text
             text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50'>
                Start coding with friends, compete in real-time
            </h3>
            <h3 className='relative z-10 text-xl md:text-3xl  text-center bg-clip-text
             text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50'>
                and sharpen your skills today.
            </h3>
               
        </div>
        <div className='flex items-center justify-center '>
            <Button
                    text={"Join Now ⚔️"}
                    onClick={()=>{router.push('/signup')}}
                    Class={`
                    bg-gradient-to-b from-zinc-200 to-zinc-400 
                    rounded-lg shadow-[0_0_15px_0_rgba(0,0,0,0.4)] text-lg
                    
                    hover:shadow-[0_0_30px_10px_rgba(80,120,200,0.2)] transform transition-all duration-400
                    ease-out
                    `}
            />
        </div>
    </div>
  )
}
