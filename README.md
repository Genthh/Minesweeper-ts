
# Minesweeper Game – Fullstack App (TypeScript)

This is a fullstack implementation of the classic Minesweeper game using TypeScript on both ends. The frontend is built with Vite + React, and the backend is powered by Node.js + Express + Prisma, with a PostgreSQL database to manage leaderboard data.

---

## Project Structure

```
minesweeper-ts/
├── backend/       → Node.js server with Express and Prisma
├── frontend/      → React frontend using Vite
```

---

## Getting Started

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd minesweeper-ts
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env  # Make sure DATABASE_URL is set
npm install
npx prisma generate
npx prisma migrate dev  # Sets up the database
npm run dev
```

The backend should now be running on http://localhost:3001

Make sure you have a PostgreSQL database running and your `.env` file includes:

```
DATABASE_URL=postgresql://your-user:your-password@localhost:5432/minesweeper
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

The frontend should now be accessible at http://localhost:5173

---

## Features

- Classic Minesweeper grid logic (bombs, flags, revealed cells)
- Timer and restart functionality
- Difficulty setting (via board size and bomb count)
- Leaderboard saved in PostgreSQL via backend API
- Responsive UI with basic styling

---

## Tech Stack

### Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend:
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL

---

## Development Tips

To generate or apply new Prisma migrations, run:

```bash
npx prisma migrate dev --name <migration-name>
```

To access the Prisma Studio UI:

```bash
npx prisma studio
```

---

## API Overview

### `GET /leaderboard`

Returns top players sorted by score/time.

### `POST /leaderboard`

Submits a new score.

**Body:**
```json
{
  "name": "Player1",
  "time": 125
}
```

---

## Scripts

### Frontend

- `npm run dev` – Start dev server
- `npm run build` – Production build

### Backend

- `npm run dev` – Start backend in dev mode using ts-node

---

## Troubleshooting

- If the backend throws a `DATABASE_URL not found` error, double-check the `.env` file.
- Make sure PostgreSQL is running and accessible from your machine.
- Ensure ports `3001` (backend) and `5173` (frontend) are free.
