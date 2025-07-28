# ⚔️ CodeClash – Real-Time Competitive Coding Platform

CodeClash is a real-time, multiplayer coding duel platform where two or more users can join a room and compete head-to-head to solve coding problems — inspired by platforms like LeetCode Duel and Codeforces Arena.

## 🔥 Features

- 🧠 **Real-Time Matchmaking:** Create or join rooms and instantly connect with another player.
- ⏱️ **Live Timer:** Synchronized countdown across clients for time-bound contests.
- 📝 **Problem Submission:** Users can submit code during the match (frontend submission currently).
- 👥 **Socket.IO Integration:** All player actions are synced in real-time (room join, timer start, submission).
- 🔒 **Authentication:** Secure login using NextAuth with session persistence.
- 📦 **Tech-Ready Backend:** Fully typed backend using Prisma ORM with PostgreSQL.
- 🌐 **Deployed on Vercel** (coming soon)

---

## 🧱 Tech Stack

| Layer         | Tech                                                                 |
|---------------|----------------------------------------------------------------------|
| **Frontend**  | Next.js, TypeScript, Tailwind CSS                                    |
| **Backend**   | Node.js, Express, Prisma, PostgreSQL                                 |
| **Real-Time** | Socket.IO                                                            |
| **Auth**      | NextAuth                                                             |
| **DevOps**    | Vercel (Frontend), Railway (optional backend), Redis (coming soon)   |

---

## 🚧 In Progress

- ⚖️ Leaderboard System (Redis + persistent history)
- 🧩 Match History Dashboard (profile, past games, stats)
- 💬 Chat or reaction system inside the room
- 🧪 Code compilation + language support (future)
- 🛡️ Room expiration / timeout handling

---

## 🛠 Setup Instructions (Local)

```bash
git clone https://github.com/nitiraj21/codeclash

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env  # Add your DB URL, GitHub OAuth keys, etc.

# Prisma DB setup
npx prisma generate
npx prisma db push

# Start development server
npm run dev
