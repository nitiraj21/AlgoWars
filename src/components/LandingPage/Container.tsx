"use client"
import React, { ReactNode, useEffect } from 'react'
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
    <div className='bg-[#262626] min-h-screen w-full flex flex-col  antialiased bg-grid-white/[0.02] relative overflow-hidden'>
      <Spotlight />
      {children}
    </div>
  )
}
