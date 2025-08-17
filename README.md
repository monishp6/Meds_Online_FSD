# Meds Online (Fullstack scaffold)

## Overview
This scaffold runs two services:
- `backend` (Express + PostgreSQL) on port 4000
- `frontend` (React + Vite) on port 5173

## Requirements
- Node 18+
- PostgreSQL (12+)
- yarn or npm

## Quickstart
1. Clone files into a folder `meds-online`.
2. Setup DB:
   - Create database: `createdb medsonline`
   - Run `psql -d medsonline -f backend/db/init.sql` to create tables and seed sample data.
3. Backend:
   - `cd backend`
   - `cp .env.example .env` and fill DB credentials
   - `npm install`
   - `npm run dev` (uses nodemon) — server runs at http://localhost:4000
4. Frontend:
   - `cd ../frontend`
   - `npm install`
   - `npm run dev` — open http://localhost:5173

## Notes
- This scaffold aims to provide a working UI matched to your screenshots and basic API functionality.
- Extend and harden auth, validation, uploads and payment for production.
