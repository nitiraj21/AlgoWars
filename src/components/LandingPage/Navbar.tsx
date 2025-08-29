"use client"
import React from 'react'
import Button from '../button'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter();
  return (
<>
  <div className="bg-black/80 h-full shadow-xl fixed inset-0 fixed" />

  <div className="flex justify-between items-center p-2 md:p-4 mt-8 mx-4 sm:mx-20 lg:mx-60 rounded-2xl shadow-lg 
                  bg-gradient-to-r from-gray-700/15 to-gray-500/15 backdrop-blur-lg transform hover:scale-105 transition-all duration-400 ease-out">
    <div className="mr-4 lg:ml-6 h-auto w-auto sm:min-h-12 min-w-12">
      <img src="./Logo.png" width={120} height={120} alt="Logo" />
    </div>
    <div className="block sm:hidden flex mr-4 lg:mr-6">
      <Button
        text={"Login"}
        Class={`
        bg-gradient-to-b from-zinc-200 to-zinc-400 
        rounded-lg shadow-[0_0_15px_0_rgba(0,0,0,0.4)]
        transition-all duration-300
        ease-out mr-3 px-3 py-2 text-sm
        hover:shadow-[0_0_30px_10px_rgba(80,120,200,0.2)]
        `}
        onClick={()=>{
          router.push("/api/auth/signin/1")
        }}
      />
      <Button
        text={"Signup"}
        Class={`
        bg-gradient-to-b from-zinc-200 to-zinc-400 
        rounded-lg shadow-[0_0_15px_0_rgba(0,0,0,0.4)]
        hover:shadow-[0_0_30px_10px_rgba(80,120,200,0.2)] transform transition-all duration-400
        ease-out px-3 py-2 text-sm
        `}
        onClick={()=>{
          router.push("/signup")
        }}
      />
    </div>
    <div className="hidden sm:block flex mr-4 lg:mr-6">
      <Button
        text={"Login"}
        Class={`
        bg-gradient-to-b from-zinc-200 to-zinc-400 
        rounded-lg shadow-[0_0_15px_0_rgba(0,0,0,0.4)]
        transition-all duration-300
        ease-out mr-6
        hover:shadow-[0_0_30px_10px_rgba(80,120,200,0.2)]
        `}
        onClick={()=>{
          router.push("/api/auth/signin/1")
        }}
      />
      <Button
        text={"Signup"}
        Class={`
        bg-gradient-to-b from-zinc-200 to-zinc-400 
        rounded-lg shadow-[0_0_15px_0_rgba(0,0,0,0.4)]
        
        hover:shadow-[0_0_30px_10px_rgba(80,120,200,0.2)] transform transition-all duration-400
        ease-out
        `}
        onClick={()=>{
          router.push("/signup")
        }}
      />
    </div>
  </div>
</>

  )
}
