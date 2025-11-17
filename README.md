# ⚔️ AlgoWars – Real-Time Competitive Coding Platform

AlgoWars is a real-time, multiplayer coding duel platform where two or more users can join a room and compete head-to-head to solve coding problems — inspired by platforms like LeetCode Duel and Codeforces Arena.

## 🔥 Features

- 🧠 **Real-Time Matchmaking:** Create or join rooms and instantly connect with another player.
- ⏱️ **Live Timer:** Synchronized countdown across clients for time-bound contests.
- 📝 **Problem Submission:** Users can submit code during the match (frontend submission currently).
- 👥 **Socket.IO Integration:** All player actions are synced in real-time (room join, timer start, submission).
- 🔒 **Authentication:** Secure login using NextAuth with session persistence.
- 📦 **Tech-Ready Backend:** Fully typed backend using Prisma ORM with PostgreSQL.
- - ⚖️ Leaderboard System (Redis + persistent history)
- 🧩 Match History Dashboard (profile, past games, stats)
- 🧪 Code compilation + language support 
- 🛡️ Room expiration / timeout handling

- 🌐 **Deployed on Vercel** - https://algowars-kappa.vercel.app/

---
<img width="1830" height="931" alt="image" src="https://github.com/user-attachments/assets/8f464470-6aba-48f7-ace8-124f1c2312ab" />
<img width="1828" height="954" alt="image" src="https://github.com/user-attachments/assets/dcd82832-1aa8-4460-a213-a725675b8376" />
<img width="1828" height="954" alt="image" src="https://github.com/user-attachments/assets/7a7fdf1e-76f3-417d-9adc-bbc5e5d263a4" />
<img width="1828" height="954" alt="image" src="https://github.com/user-attachments/assets/79327a26-44a7-499b-aeca-9f889d440985" />




## 🧱 Tech Stack

| Layer         | Tech                                                                 |
|---------------|----------------------------------------------------------------------|
| **Frontend**  | Next.js, TypeScript, Tailwind CSS                                    |
| **Backend**   | Node.js, Express, Prisma, PostgreSQL                                 |
| **Real-Time** | Socket.IO                                                            |
| **Auth**      | NextAuth                                                             |
| **DevOps**    | Vercel (Frontend), Railway (optional backend), Redis (coming soon)   |

---


## 🛠 Setup Instructions (Local)

```bash
git clone https://github.com/nitiraj21/AlgoWars

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env  # Add your DB URL, GitHub OAuth keys, etc.

# Prisma DB setup
npx prisma generate
npx prisma db push

# Start development server
npm run start
