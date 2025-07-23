
import React from 'react';
import { Participant } from '../types/global';
import { Session } from 'next-auth';
type ParticipantListProps = {
    participants: Participant[];
    hostName: string;
    currentUserUsername: string | undefined | null;
  };

export default function ParticipantList({ participants, hostName, currentUserUsername }: ParticipantListProps){
    return(
        <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-bold text-lg mb-3">Participants ({participants.length}):</h2>
          <div className="space-y-2">
            {participants.map(p => (
              <div key={p.id || p?.user?.username} className="p-2 bg-gray-100 rounded flex justify-between items-center">
                <span>{p?.user?.username}</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  p.role === 'host' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
                }`}>
                  {p.role}
                </span>
              </div>
            ))}
          </div>
        </div>
        </div>
    )
}