import React from 'react'

function Badges() {
  return (
    <div className='w-auto bg-gradient-to-r from-gray-500/15 to-gray-500/15 backdrop-blur-xl rounded-xl shadow-xl mb-5 mr-4 pb-6'>
        <div className='flex items-center justify-center mt-2'>
        <h1 className='font-semibold text-2xl mt-2'>Badges</h1>
        </div>
        <div className='flex justify-center items-center'>
          <img src={"./WinStreak.png"} width={115} height={115} />
          <img src={"./Streaks.png"} width={115} height={115} />
        </div>
    </div>
  )
}

export default Badges