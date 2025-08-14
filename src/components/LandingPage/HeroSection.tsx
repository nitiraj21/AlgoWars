"use client"
import React from 'react'
import { Spotlight } from '../ui/spotlight-new'
import Button from '../button'


export default function HeroSection() {
  return (
<div className="h-[40rem] w-full  rounded-md flex flex-col items-center justify-center relative overflow-hidden mt-10  ">
  
  <div className="absolute inset-0 pointer-events-none z-0">
    <div className='flex justify-center items-center'>
    <img src={"./LogoHero.png"} width={400} height={400}/>
    </div>
      

    <h1 className="relative z-10 text-5xl md:text-8xl mb-5 font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50"> 
      Algo Wars
    </h1>
  
    <h1 className="relative z-10 text-3xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50"> 
      Code. Compete. Conquer.
    </h1>
  
    <br/>

    <h3 className="relative z-10 text-xl md:text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
      Real-time coding battles, DSA challenges, <br/> and  leaderboards — fight your way to the top.
    </h3>
    <div className='flex justify-center items-center mt-6'>
  <Button 
      text = {"Start the Battle"}
      Class= {"bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 shadow-lg   hover:from-neutral-300 hover:to-neutral-700 hover:text-white"}
    />
  </div>
  </div>

</div>

  )
}
