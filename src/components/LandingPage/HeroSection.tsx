"use client"
import React from 'react'
import { Spotlight } from '../ui/spotlight-new'
import Button from '../button'


export default function HeroSection() {
  return (
<div className="h-[40rem] w-full  rounded-md flex flex-col items-center justify-center relative overflow-hidden  md:mt-30 mb-6 md:mb-40 ">
  
  <div className="absolute inset-0  z-0">
    <div className='flex justify-center items-center mb-5'>
    <img src={"./LogoHero.png"} width={350} height={350}/>
    </div>
      

    <h1 className="relative z-10 text-5xl md:text-8xl mb-5 font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50"> 
      AlgoWars
    </h1>
  
    <h1 className="relative z-10 text-3xl md:text-6xl font-xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50"> 
      Code. Compete. Conquer.
    </h1>
  
    <br/>

    <h3 className="relative z-10 text-lg md:text-xl font-xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-400 bg-opacity-80">
      Real-time coding battles, DSA challenges,
    </h3>
    <h3 className="relative z-10 text-lg md:text-xl font-xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-400 bg-opacity-80">
      and leaderboards — fight your way to the top.
    </h3>
    <div className='flex justify-center items-center mt-10 '>
    <Button 
      text = {"Start the Battle"}
      Class= {`
    bg-gradient-to-b from-zinc-200 to-zinc-400 
    rounded-lg shadow-[0_0_15px_0_rgba(0,0,0,0.4)]
    transition-all duration-300
    ease-out
    hover:shadow-[0_0_35px_10px_rgba(80,120,200,0.4)]
      `}
    />
  </div>
  </div>

</div>

  )
}
