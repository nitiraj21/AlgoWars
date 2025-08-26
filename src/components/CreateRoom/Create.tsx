'use client'
import { useState } from 'react'
import axios from "axios";
import { useRouter } from "next/navigation";
import Button from '../button';
import { Router } from 'next/router';

export default function CreateRoom() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const createRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("Room") as string;
    const Duration = Number(formData.get("Duration"));
    const Questions = Number(formData.get("Questions"));    

    if (!name) {
      setError("Please enter room name");
      setIsLoading(false);
      return;
    }

    if (Duration < 1) {
      setError("Minimum Duration is 1 minute");
      setIsLoading(false);
      return;
    }
    if (Questions < 1) {
      setError("Select atleat one Question");
      setIsLoading(false);
      return;
    }

    try {

      const res = await axios.post('/api/room/create', {
        name,
        Duration,
        isPrivate: false,
        Questions,
      });

      if (res) {
        router.push(`/Room/${res.data.roomcode}`)
        }
       else {
        setError( "Something went wrong");
      }
    }
   catch (err) {
      setError("Network error. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    

<div className="flex justify-center items-center min-h-screen bg-[#0e0f11]">

          {/* Room Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl px-16 pb-8 pt-4 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          <div className='flex items-center justify-center mb-3'>
          <img src={"./Logo.png"} width={140} height={140} />
          </div>
          <form onSubmit={createRoom} className="space-y-5">
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-300 mb-2">
                Room Name
              </label>
              <input
                id="Room"
                name="Room"
                type="text"
                required
                placeholder="Enter Room name"
                className="w-full px-7 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="number" className="block text-sm font-medium text-gray-300 mb-2">
                Match Duration (mins)
              </label>
              <input
                id="Duration"
                name="Duration"
                type="number"
                required
                placeholder="Duration"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-300 mb-2">
                No. of Questions
              </label>
              <input
                id="Questions"
                name="Questions"
                type="number"
                required
                placeholder="Number of Questions"
                minLength={6}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg cursor-pointer mt-4 font-semibold py-3 px-4 rounded-lg hover:from-gray-600 hover:to-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </form>
          </div>
</div>

  )
}