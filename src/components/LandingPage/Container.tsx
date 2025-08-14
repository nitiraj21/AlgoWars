"use client"
import React, { ReactNode } from 'react'
import { Spotlight } from '../ui/spotlight-new'
export default function Container({children}: {children : ReactNode})   {
  return (
    <div className='bg-[#262626] min-h-screen w-full flex flex-col  antialiased bg-grid-white/[0.02] relative overflow-hidden'>
      <Spotlight />
      {children}
    </div>
  )
}
