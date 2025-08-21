'use client'
import { useState } from 'react'
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CreateRoom() {
  const [name, setName] = useState('')
  const [duration, setDuration] = useState("")
  const [questions, setQuestions] = useState("")
  const router = useRouter();
  const createRoom = async () => {
    const MatchDuration = parseInt(duration, 10);
    const noOFQuestions = parseInt(questions, 10);    
    try {
        const res = await axios.post('/api/room/create', {
          name,
          MatchDuration,
          isPrivate: false,
          noOFQuestions,
        });
        router.push(`/Room/${res.data.roomcode}`)
        
      } catch (error: any) {
        alert(`Error: ${error.response?.data?.error || error.message}`);
      }
  }

  return (
<div className="flex justify-center items-center min-h-screen bg-[#0e0f11]">
  <div className="w-full max-w-md p-8 bg-gradient-to-b from-gray-800/60 to-gray-900/60 
                  backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700">
    <h2 className="text-2xl font-bold text-center text-white mb-6">Create a Room</h2>

    <div className="flex flex-col space-y-4">
      <div>
        <label className="block text-gray-300 mb-1 text-sm">Room Name</label>
        <input
          className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800/50 text-white 
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter room name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-1 text-sm">Match Duration (mins)</label>
        <input
          className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800/50 text-white 
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-1 text-sm">No. of Questions</label>
        <input
          className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800/50 text-white 
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Number of questions"
          value={questions}
          onChange={(e) => setQuestions(e.target.value)}
        />
      </div>

      <button
        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 
                   text-white font-semibold py-3 rounded-lg shadow-md"
        onClick={createRoom}
      >
        Create Room
      </button>
    </div>
  </div>
</div>

  )
}