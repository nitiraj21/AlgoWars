'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function JoinRoom() {
  const [code, setCode] = useState('')
  const router = useRouter();

  const handleJoin = async () => {
    const res = await fetch('/api/room/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })

    const data = await res.json()
    if (res.ok) {
      router.push(`/Room/${data.room.code}`)
    } else {
      alert(data.error)
    }
  }

  return (
    <div className="p-4">
      <input
        placeholder="Enter Room Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="border p-2"
      />
      <button
        onClick={handleJoin}
        className="ml-2 bg-green-500 text-white px-4 py-2 rounded"
      >
        Join Room
      </button>
    </div>
  )
}
