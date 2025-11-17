✨ Key Features

AlgoWars is a full-stack, real-time application where users can challenge each other in live coding matches.

⚡ Real-time Multiplayer: Uses Socket.IO and a dedicated Express server for instant synchronization of match state, code submissions, and results.

🛡️ Private Rooms: Create private coding rooms and share the unique Room ID with a friend to start a match.

🏆 Gamified Progression: A complete gamification system with XP, Ranks (Bronze, Silver, Gold, etc.), and Badges (Win Streaks, 100 Wins) to reward users.

📊 User Dashboard: A personal dashboard to track stats, including win/loss ratio, match history, rank, and earned badges.

🌍 Global Leaderboard: See how you stack up against other players on the global leaderboard.

🖥️ Integrated Code Editor: A built-in editor (inferred from Questions.tsx) to write and submit solutions directly in the browser.

🔐 Secure Authentication: Full user authentication and session management handled by NextAuth.js.

🛠️ Tech Stack

This project uses a monorepo structure with a Next.js frontend and a dedicated backend server for real-time operations.

Frontend & Application

Technology

Description

Next.js

React framework for the user interface, routing (App Router), and API layer.

TypeScript

Primary language for type safety across the entire application.

Tailwind CSS

Utility-first CSS framework for rapid and consistent styling.

shadcn/ui

Reusable and accessible UI components.

Socket.IO Client

Handles real-time communication from the client-side to the game server.

NextAuth.js

Manages all user authentication flows (e.g., credentials, social logins).

Backend & Infrastructure

Technology

Description

Node.js / Express

Dedicated backend server (server/index.ts) for the real-time matching engine.

Socket.IO Server

Manages WebSocket connections, room logic, and match state synchronization.

Prisma

Next-generation ORM for database interaction, migrations, and seeding.

PostgreSQL

(Inferred from Prisma) Primary SQL database for persistent data.

Redis

(Inferred from lib/redis.ts) Used for caching, session management, or storing transient match state.

⚙️ Prerequisites

Before you begin, ensure you have the following installed on your local machine:

Node.js (v18 or later)

npm or yarn

PostgreSQL Database Server

Redis Server

Docker (Optional, for easily running Postgres & Redis)

🚀 Installation & Local Setup

Follow these steps to get your development environment up and running.

1. Clone the Repository

git clone [https://github.com/nitiraj21/algowars.git](https://github.com/nitiraj21/algowars.git)
cd algowars


2. Configure Environment Variables

This project requires two .env files: one for the Next.js app (root) and one for the Express server (server/).

A. Root .env file
Create a file named .env in the root of the project.

# ----------------------------------
# DATABASE (PRISMA)
# ----------------------------------
# Your PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/algowars?schema=public"

# ----------------------------------
# NEXTAUTH.JS
# ----------------------------------
NEXTAUTH_URL="http://localhost:3000"
# Generate a secure secret: openssl rand -base64 32
NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET"

# ----------------------------------
# REDIS
# ----------------------------------
# Your Redis connection URL
REDIS_URL="redis://:PASSWORD@HOST:PORT"

# ----------------------------------
# CLIENT-SIDE
# ----------------------------------
# URL of your dedicated real-time server
NEXT_PUBLIC_API_URL="http://localhost:8000"


B. Server .env file
Create a file named .env inside the /server directory.

# Port for the Express/Socket.IO server
PORT=8000

# Redis URL for the server
REDIS_URL="redis://:PASSWORD@HOST:PORT"

# Database URL (if needed by the server for direct queries)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/algowars?schema=public"


3. Install Dependencies

Install dependencies for both the root (Next.js) and the server (Express) packages.

# Install root (frontend) dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..


4. Setup the Database

Run the Prisma migrations to set up your PostgreSQL database schema.

# Apply all pending migrations
npx prisma migrate deploy

# (Optional) Seed the database with initial problems or data
npx prisma db seed


5. Run the Application

You must start both the backend and frontend servers in two separate terminal windows.

Terminal 1: Start the Backend Server (Socket.IO)

cd server
npm run dev
# Server will be running on http://localhost:8000


Terminal 2: Start the Frontend Application (Next.js)

# In the root directory
npm run dev
# Application will be accessible at http://localhost:3000


You should now be able to access the application in your browser!

📂 Project Structure

Here is a high-level overview of the project's structure:

.
├── components/                # Custom/overridden shadcn-ui components
├── prisma/                    # Prisma schema, migrations, and seed script
│   ├── migrations/            # Database migration history
│   └── schema.prisma          # The single source of truth for your DB schema
├── public/                    # Static assets (images, badges, logos)
├── server/                    # The dedicated Express + Socket.IO backend
│   ├── index.ts               # Main server entry point for Socket.IO logic
│   └── package.json           # Backend dependencies (express, socket.io, etc.)
└── src/
    ├── app/                   # Next.js 13+ App Router
    │   ├── (main)/            # Route group for authenticated pages
    │   │   ├── CreateRoom/
    │   │   ├── Room/[roomid]/ # Dynamic page for the live match
    │   │   ├── dashboard/     # User dashboard
    │   │   └── joinRoom/
    │   ├── api/               # Next.js API routes (auth, REST endpoints)
    │   ├── layout.tsx         # Root layout
    │   └── page.tsx           # Public landing page
    ├── components/            # Main React components for the application
    │   ├── Dashboard/         # Dashboard-specific components (Badges, MatchHistory)
    │   ├── LandingPage/       # Components for the public homepage
    │   ├── Room/              # Components for the live match room
    │   ├── Questions.tsx      # The code editor and problem display
    │   ├── Timer.tsx          # Match timer
    │   └── Winner.tsx         # Modal/component to display after match ends
    ├── hooks/                 # Custom React hooks (e.g., useRoomSocket)
    ├── lib/                   # Core utilities and library initializations
    │   ├── auth.ts            # NextAuth.js configuration
    │   ├── prisma.ts          # Prisma client instance
    │   └── redis.ts           # Redis client instance
    └── types/                 # Global TypeScript definitions
