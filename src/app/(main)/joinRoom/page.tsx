'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios';

export default function JoinRoom() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleJoin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const code = formData.get("Room") as string;

    if(!code){
      setError("Please enter a Room Code");
      setIsLoading(false);
      return;
    }

    try{
      const res = await axios.post("/api/room/create", {
        code
      });

      if(res){
        router.push(`/Room/${res.data.room.code}`)
      }
    }
    catch (err) {
      setError("Please enter correct Room ID");
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0e0f11]">

      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl px-13 py-5 shadow-2xl">
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
        </div>)}
      <form onSubmit={handleJoin} className="space-y-5">
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-300 mb-2">
                Room ID
              </label>
              <input
                id="Room"
                name="Room"
                type="text"
                required
                placeholder="Enter Room ID"
                className="w-full px-7 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white cursor-pointer font-semibold py-3 px-4 rounded-lg hover:from-gray-600 hover:to-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Creating Room...
                </div>
              ) : (
                "Create Room"
              )}
            </button>
            </div>
      </form>
      </div>
    </div>
  )
}
