import React from 'react'

export default function Mockup() {
  return (
    <div className='z-50 mb-20'>
      <div className='mb-10' data-aos="fade-down">
        <h1 className="relative z-10 text-3xl md:text-6xl font-xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50"> 
        Challenge → Solve → Win.
        </h1>
      </div>
      <div className='z-50 flex flex-col justify-center items-center  md:flex-row '>

        <div data-aos="fade-right">
        <img src={"./Question.png"} className='transform ' />
        </div>

        <div data-aos="fade-up">
        <img src={"./CodeEditor.png"} className='transform ' />
        </div>
        <div data-aos="fade-left">
        <img src={"./LeaderBoard.png"} className='transform ' />
        </div>
      </div>
    </div>
  )
}
