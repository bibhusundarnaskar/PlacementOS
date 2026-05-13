# PlacementOS

Production-grade full-stack AI career assistant built with Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui conventions, PostgreSQL, Prisma, Clerk Auth, Google Gemini, and REST API routes.

## Features

- Resume upload and parsing for PDF, DOCX, and TXT files
- ATS resume scoring with AI-backed suggestions
- Company-specific interview question generation
- Authenticated student dashboard
- Progress tracking API and dashboard views
- Dark mode with `next-themes`
- Responsive Linear/Notion-inspired UI
- Dockerized PostgreSQL and standalone Next.js production image

## Tech Stack

- `next@15` App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui-style primitives in `src/components/ui`
- Prisma + PostgreSQL
- Clerk Auth
- Google Gemini SDK
- REST API architecture under `src/app/api`

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Start PostgreSQL:

```bash
docker compose up -d
```

4. Generate Prisma client and push schema:

```bash
npm run db:generate
npm run db:push
```

5. Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment

Required:

- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

Optional:

- `GEMINI_API_KEY`
- `GEMINI_MODEL`

When `GEMINI_API_KEY` is not set, PlacementOS uses deterministic fallback logic for ATS scoring and interview question generation so local development still works.

## Project Structure

```text
src/app                 App Router pages and REST API routes
src/app/api             Authenticated REST endpoints
src/components/ui       Reusable shadcn-style UI primitives
src/components/dashboard Dashboard feature components
src/components/providers Global providers
src/lib/ai              Gemini services and structured AI helpers
src/lib/resume          Resume parsing utilities
src/lib/validations     Zod request schemas
src/lib/prisma.ts       Prisma singleton
prisma/schema.prisma    PostgreSQL schema
```

## API Routes

- `GET /api/resumes`
- `POST /api/resumes`
- `POST /api/ats-score`
- `POST /api/interview-questions`
- `GET /api/progress`
- `POST /api/progress`

All API routes are protected by Clerk middleware.

## Production

Build locally:

```bash
npm run build
npm run start
```

Build container:

```bash
docker build -t placementos .
docker run --env-file .env -p 3000:3000 placementos
```

## Notes

- Keep uploaded file sizes small. The default parser limit is 5MB.
- Run `npm run lint` and `npm run build` before opening a pull request.
- Use Prisma migrations for shared environments: `npm run db:migrate`.
