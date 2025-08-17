"use client"
import React, { ReactNode, useEffect } from 'react'
import { Particles } from "../ui/shadcn-io/particles";
import { Spotlight } from '../ui/spotlight-new'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion } from 'framer-motion';
export default function Container({children}: {children : ReactNode})   {

useEffect(() => {
  AOS.init({
    duration: 1000, // animation duration
    easing: 'ease-out-cubic', // smooth easing
    once: true // run only once
  });
}, []);
  return (
    <div className='bg-[#262626] min-h-screen w-full flex flex-col  antialiased bg-grid-white/[0.02] relative overflow-hidden z-50'>
      <Spotlight />
      {children}
      <Particles
        className="absolute inset-0"
        quantity={150}
        ease={60}
        staticity={30}
        color="#3b82f6"
        size={1.2}
      />
    </div>
  )
}
