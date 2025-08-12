import React, { ReactNode } from 'react'

export const DashboardLayout = ({children}: {children : ReactNode}) => {
  return (
    <div className='flex h-screen w-full bg-[#121315] text-white'>
        {children}
    </div>
    
  )
}
