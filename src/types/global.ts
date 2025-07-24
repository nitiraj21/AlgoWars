export interface Participant {
  id: string;
  user: { username: string };
  role: 'host' | 'participant';
}
export enum difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}
export enum RoomStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
}

export interface Room {
  name: string;
  host: { name: string };
  participants: Participant[];
  questions: {
    id: string;
    title: string;
    description?: string;
    difficulty?: difficulty;
    testCases : {
      Input : string,
      Output : string,
      target? : string
    }
  }[];
  status?: RoomStatus; 
  matchStartedAt : string
}