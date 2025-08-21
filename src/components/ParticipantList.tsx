
import React from 'react';
import { Participant } from '../types/global';
import { Session } from 'next-auth';
type ParticipantListProps = {
    participants: Participant[];
    hostName: string;
    currentUserUsername: string | undefined | null;
    status? : string
  };

export default function ParticipantList({ participants, hostName, currentUserUsername }: ParticipantListProps){
    return(
<div className="bg-[#1c1d21] rounded-xl p-6 shadow-md border border-gray-700">
  <h2 className="text-xl font-semibold mb-4">
    Participants <span className="text-gray-400">({participants.length})</span>
  </h2>
  <div className="space-y-2">
    {participants.map((p) => (
      <div
        key={p.id || p?.user?.username}
        className="flex justify-between items-center px-4 py-2 
                   bg-[#2a2b31] rounded-lg border border-gray-700
                   hover:bg-[#34363c] transition-colors"
      >
        <span className="font-medium">{p?.user?.username}</span>
        <span
          className={`px-3 py-1 rounded-lg text-xs font-semibold border 
            ${
              p.role === "host"
                ? "bg-blue-600/20 text-blue-400 border-blue-500/40"
                : "bg-gray-600/30 text-gray-300 border-gray-500/30"
            }`}
        >
          {p.role}
        </span>
      </div>
    ))}
  </div>
</div>
    )
}