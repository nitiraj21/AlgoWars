'use client'
import { useState } from 'react'

export default function RoomForm() {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')

  const createRoom = async () => {
    const res = await fetch('/api/room/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        code, // optional
        isPrivate: false,
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
        placeholder="Room Code (optional)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
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
