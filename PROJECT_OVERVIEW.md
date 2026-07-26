# AI Interview Platform — Project Overview

A full-stack web app that lets a user practice job interviews with AI-generated
questions and get AI-scored feedback on their answers.

## Tech Stack

**Frontend** (this repo)
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4 for styling
- `react-hook-form` for form handling, `react-hot-toast` for notifications
- Hosted on **Vercel**

**Backend** (`AI-Interview-Platform-Backend`)
- Node.js + Express 5
- MongoDB with Mongoose (hosted on **MongoDB Atlas**)
- JWT-based authentication (`jsonwebtoken` + `bcryptjs` for password hashing)
- **Groq** (`llama-3.3-70b-versatile`) as the AI provider — generates interview
  questions and evaluates submitted answers
- Hosted on **Render**

Three external services total: Vercel, Render, MongoDB Atlas. No other
third-party integrations (no cloud storage, email, payments, analytics).

## Data Models (MongoDB)

**User**
- `name`, `email` (unique), `password` (bcrypt-hashed), timestamps

**Interview**
- `userId` (ref → User)
- `role`, `topic`
- `questions: string[]`, `answers: string[]`
- `score` (number, null until submitted)
- `feedback` (string, null until submitted)
- `status`: `"in-progress"` | `"completed"`
- timestamps

## API Endpoints (Backend)

| Method | Path                       | Auth | Description                                      |
|--------|-----------------------------|------|---------------------------------------------------|
| POST   | `/api/auth/register`        | —    | Create account, returns JWT + user                |
| POST   | `/api/auth/login`           | —    | Verify credentials, returns JWT + user             |
| GET    | `/api/user/profile`         | ✅   | Get the logged-in user's profile                   |
| POST   | `/api/interview/generate`   | ✅   | AI-generate questions for a role/topic, creates Interview doc |
| POST   | `/api/interview/submit/:id` | ✅   | Submit answers, AI scores + gives feedback, marks completed |
| GET    | `/api/interview/history`    | ✅   | List the user's interviews (newest first)          |
| GET    | `/api/interview/:id`        | ✅   | Get a single interview (ownership-checked)          |
| DELETE | `/api/interview/:id`        | ✅   | Delete an interview (ownership-checked)             |

**Auth flow:** on login/register, the backend signs a JWT (`{ id }`, 7-day
expiry) with `JWT_SECRET`. The frontend stores it in `localStorage` and sends
it as `Authorization: Bearer <token>` on every request. Backend middleware
(`authMiddleware.protect`) verifies the token and attaches the user to
`req.user`; interview routes additionally check the interview's `userId`
matches the requester before allowing access/deletion.

## Frontend Pages

| Route | Purpose |
|---|---|
| `/` | Redirects to `/login` |
| `/login`, `/register` | Auth forms |
| `/dashboard` | Overview: stat cards, recent interviews, in-progress banner, quick-start CTA |
| `/history` | Full list of past interviews with delete action |
| `/mock-interviews` | Setup form — pick role, experience, topic, question count → generates a new interview |
| `/mock-interviews/session` | Active interview flow — answer questions one by one |
| `/mock-interviews/results` | Shows score, AI feedback, and Q&A for a completed interview |
| `/practice` | Lightweight single-topic practice mode (no full interview record) |
| `/profile` | User info + Overview/Analytics tabs (charts: score over time, topic performance, score distribution) |

## Frontend State/API layer

- `lib/auth-context.tsx` — React Context (`AuthProvider`/`useAuth`) holding
  `user`/`token`, persisted to `localStorage`, exposes `login`/`register`/`logout`.
- `lib/api.ts` — thin `fetch` wrapper; reads `NEXT_PUBLIC_API_URL`, auto-attaches
  the JWT to every request, and on a 401 response clears storage and redirects
  to `/login`.

## How to talk about this in an interview

- **What it does**: lets users practice mock interviews — pick a role/topic,
  get AI-generated questions, answer them, and receive an AI-generated score
  and written feedback, with history and analytics to track progress over time.
- **Why these choices**: JWT auth keeps the backend stateless; MongoDB's
  flexible schema suits variable-length question/answer arrays per interview;
  Groq was chosen for fast, cheap LLM inference for question generation and
  answer scoring.
- **Architecture**: decoupled frontend/backend — Next.js SPA-style client
  talking to a REST API over JSON, deployed independently (Vercel + Render),
  which mirrors how many real production systems are split.
