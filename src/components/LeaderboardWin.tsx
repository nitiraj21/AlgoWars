import React from "react";

interface Participant {
    user?: {
        username?: string;
        profilePic? :string
    };
    score: number;
  }

interface LeaderboardProps {
    participants: Participant[];
  }
export const LeaderboardWin = ({ participants }: LeaderboardProps) => {
    const sortedParticipants = [...participants].sort((a, b) => (b.score  || 0) - (a.score || 0));
    
    return (
      <div className="space-y-1">
        {sortedParticipants.map((participant, index) => {
          const rank = index + 1;
          const score = participant.score || 0;
          
          return (
            <div 
              key={rank}
              className={`
                group flex items-center justify-between py-6 px-8 
                border-b border-gray-600 hover:border-gray-600 
                transition-all duration-500 ease-out hover:bg-slate-800 hover:bg-opacity-20
                ${rank <= 3 ? 'border-white border-opacity-20' : ''}
              `}
            >
              {/* Left: Rank and Name */}
              <div className="flex items-center space-x-8">
                <div className={`
                  text-2xl font-light w-12 text-center transition-all duration-300
                  ${rank === 1 ? 'text-yellow-400 font-normal text-3xl' : ''}
                  ${rank === 2 ? 'text-gray-300' : ''}
                  ${rank === 3 ? 'text-amber-600' : ''}
                  ${rank > 3 ? 'text-gray-500' : ''}
                `}>
                  {rank}
                </div>
                
                <div>
                  <h3 className={`
                    text-2xl font-light tracking-wide transition-all duration-300 group-hover:text-white
                    ${rank === 1 ? 'text-white font-normal text-3xl' : ''}
                    ${rank === 2 ? 'text-gray-200' : ''}
                    ${rank === 3 ? 'text-gray-300' : ''}
                    ${rank > 3 ? 'text-gray-400' : ''}
                  `}>
                    {participant.user?.username}
                  </h3>
                </div>
              </div>
  
              {/* Right: Score */}
              <div className="text-right">
                <div className={`
                  text-2xl font-light tracking-wider transition-all duration-300
                  ${rank === 1 ? 'text-yellow-400 font-normal text-3xl' : ''}
                  ${rank === 2 ? 'text-gray-200' : ''}
                  ${rank === 3 ? 'text-amber-600' : ''}
                  ${rank > 3 ? 'text-gray-400 group-hover:text-gray-300' : ''}
                `}>
                  {score.toLocaleString()}
                </div>
                <div className="text-gray-600 text-sm font-light tracking-wider">
                  POINTS
                </div>
              </div>
  
              {/* Subtle indicator for top 3 */}
            </div>
          );
        })}
      </div>
    );
  };