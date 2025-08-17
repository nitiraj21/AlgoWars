import React from 'react'

function HowItWorks() {
    const steps = [
        {title : "Create a Room", img : "./Room2.png"},
        {title : "Invite your Friends" , img : "./JoinUsers.png"},
        {title : "Climb Leaderboard" , img : "./Leaderboard.png"}
    ]

  return (
    <div className='mt-10 mb-10 bg-black/80 h-full'>
        <div className="mb-10 bg-black/80 transform hover:scale-103 transition-transform duration-400 ease-in-out  overflow-hidden
         bg-gradient-to-r from-gray-700/15 to-gray-500/15 backdrop-blur-lg relative mt-16 mx-16 md:mx-40 px-4 flex flex-col items-center
          border-2 border-slate-600 cursor-pointer rounded-2xl py-12 mb-10 z-50 hover:shadow-[0_0_40px_10px_rgba(80,120,200,0.2)] ">
        <div>
            <h1 className="relative z-10 text-3xl md:text-6xl font-xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50"> 
                How It Works
            </h1>
        </div>
        <div className='flex flex-col md:flex-row justify-center items-center mt-8'>
        {steps.map((t)=>(
            <div key={t.title} className=' z-50 ml-5 mr-5 '>
                {t.img === "./Leaderboard.png" ? <img src={t.img} width={160} height={160} className='mb-2 ml-4 md:ml-6'/> : <img src={t.img} width={250} height={250} className='mb-2'/>}
            
            <h3 className="relative z-10 text-xl md:text-2xl  text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50"> 
                {t.title}
            </h3>
            </div>
        ))}
        </div>
        </div>
    </div>
  )
}

export default HowItWorks