'use client'
import { useState } from 'react'

export default function RoomForm() {
  const [name, setName] = useState('')
  const [duration, setDuration] = useState("")
  const [questions, setQuestions] = useState("")
  const createRoom = async () => {
    const MatchDuration = parseInt(duration, 10);
    const noOFQuestions = parseInt(questions, 10);    
    const res = await fetch('/api/room/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        MatchDuration, 
        isPrivate: false,
        noOFQuestions
      }),
    })

    const data = await res.json()
    console.log(data)

    if (res.ok) {
      alert(`Room Created: ${data.roomcode}`)
    } else {
      alert(`Error: ${data.error}`)
    }
  }

  return (
    <div className="p-6">
      <input
        className="border p-2 mr-2"
        placeholder="Room Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border p-2 mr-2"
        placeholder="Duration"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <input
        className="border p-2 mr-2"
        placeholder="No. of Questions"
        value={questions}
        onChange={(e) => setQuestions(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={createRoom}
      >
        Create Room
      </button>
    </div>
  )
}
