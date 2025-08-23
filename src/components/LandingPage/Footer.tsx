"use client"
import React from 'react'
import { FaGithub, FaTwitter} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full py-4 mt-20 border-t border-white/20 text-center bg-gray-600 backdrop-blur-sm">
    <p className="text-lg text-white font-michroma">Made with ❤️ by Nitiraj Singh Chouhan</p>
    <div className="flex justify-center gap-4 mt-2">
      <div onClick={()=>{window.open("https://github.com/nitiraj21")}}><FaGithub className="h-6 w-6 cursor-pointer text-white  ml-2"/></div>
      <div onClick={()=>{window.open("https://x.com/nitiraj_21")}}><FaTwitter className="h-6 w-6 cursor-pointer text-white "/></div>
    </div>
    <p className="text-sm text-white/60 mt-2">  Built in the dark, shipped with caffeine. Fork it, improve it, or just vibe.</p>
  </footer>
  )
}
