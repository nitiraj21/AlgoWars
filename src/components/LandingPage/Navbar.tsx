import React from 'react'
import Button from '../button'

export default function Navbar() {
  return (
<>
  <div className="bg-black/80 h-full shadow-xl fixed inset-0" />

  <div className="flex justify-between items-center p-2 md:p-4 mt-12 mx-20 lg:mx-60 rounded-2xl shadow-lg 
                  bg-gradient-to-r from-gray-700/5 to-gray-500/15 backdrop-blur-lg">
    <div className="mr-4 lg:ml-6">
      <img src="./Logo.png" width={120} height={120} alt="Logo" />
    </div>
    <div className="mr-4 lg:mr-6">
      <Button
        text={"Signup"}
        Class={`
    bg-gradient-to-b from-zinc-200 to-zinc-400 
    rounded-lg shadow-[0_0_15px_0_rgba(0,0,0,0.4)]
    transition-all duration-300
    ease-out
    hover:shadow-[0_0_30px_10px_rgba(80,120,200,0.2)]
        `}
      />
    </div>
  </div>
</>

  )
}
