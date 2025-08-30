# Task Manager API

TypeScript + Express + PostgreSQL (Prisma) backend using MVC patterns with JWT auth, strong validation, and full task CRUD.

## Stack

- Runtime: Node.js (>= 18)
- Framework: Express
- Language: TypeScript
- ORM: Prisma (PostgreSQL)
- Auth: JWT (jsonwebtoken)
- Validation: express-validator
- Security: bcryptjs (password hashing), CORS

## Features

- User registration and login with strong password rules and email normalization
- Password hashing (bcrypt) and stateless JWT authentication
- Tasks CRUD scoped to the authenticated user
- Task fields: task_id, task_title, task_description, is_read, user_id, timestamps
- Toggle endpoint to flip task is_read
- Centralized error handling and 404 fallback

## Project Structure

```
src/
	app.ts               # Express app wiring (middleware, routes, errors)
	server.ts            # Entrypoint
	config/
		env.ts             # Environment config loader
		db.ts              # Prisma client
	controllers/         # Route handlers (auth, user, task)
	middlewares/         # Auth + error middlewares
	models/              # Data access using Prisma (UserModel, TaskModel)
	routes/              # Express routers
	types/               # Shared types
	utils/               # Hashing + JWT helpers
prisma/
	schema.prisma        # Prisma schema
```

## Prerequisites

- Node.js 18+
- A PostgreSQL connection string

## Environment Variables

Create a `.env` file in the project root with at least:

```properties
DATABASE_URL=postgresql://user:password@host:port/dbname?sslmode=require
PORT=4000
NODE_ENV=development
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=10
```

## Setup

1. Install dependencies

```bash
npm install
```

2. Generate Prisma client and sync schema to DB

```bash
npx prisma generate
npx prisma db push
```

3. Start the dev server

```bash
npm run dev
```

The server will run at http://localhost:${PORT} (default 4000).

## NPM Scripts

- `npm run dev` — Start in watch mode (ts-node-dev)
- `npm run build` — Compile TypeScript to `dist/`
- `npm start` — Run compiled JS from `dist/`
- `npm run prisma:generate` — Prisma client generation
- `npm run prisma:push` — Sync schema to DB (no migrations history)
- `npm run prisma:migrate` — Apply migrations (if you add migrations)
- `npm run prisma:studio` — Open Prisma Studio

## API Reference

Base URL: `/api`

### Auth

POST `/auth/register`

Body:

```json
{
  "first_name": "Ada",
  "last_name": "Lovelace",
  "email": "ada@example.com",
  "password": "Secretp@ss123!"
}
```

Rules:

- email must be valid (normalized)
- password must be strong (min 8, 1 upper, 1 lower, 1 number, 1 symbol)

Response: `201 Created`

```json
{
  "user": {
    "user_id": 1,
    "first_name": "Ada",
    "last_name": "Lovelace",
    "email": "ada@example.com"
  },
  "token": "<jwt>"
}
```

POST `/auth/login`

Body:

```json
{ "email": "ada@example.com", "password": "Secretp@ss123!" }
```

Response: `200 OK`

```json
{
  "user": {
    "user_id": 1,
    "first_name": "Ada",
    "last_name": "Lovelace",
    "email": "ada@example.com"
  },
  "token": "<jwt>"
}
```

Auth header for protected routes:

```
Authorization: Bearer <token>
```

### Users

GET `/users/me` — current user (auth)

GET `/users` — list users (safe fields)

### Tasks (auth required)

GET `/tasks` — list current user’s tasks

POST `/tasks`

Body:

```json
{
  "task_title": "Read paper",
  "task_description": "On distributed systems",
  "is_read": false
}
```

GET `/tasks/:id`

PUT `/tasks/:id`

Body (any subset):

```json
{
  "task_title": "Updated title",
  "task_description": "Updated",
  "is_read": true
}
```

DELETE `/tasks/:id`

PATCH `/tasks/:id/toggle-read` — flips `is_read`

## Validation & Security

- Email validation and normalization via express-validator
- Strong password policy enforced on registration
- Passwords hashed with bcrypt (configurable salt rounds)
- JWT signed with `JWT_SECRET` and `JWT_EXPIRES_IN`
- All task routes require a valid Bearer token and enforce per-user ownership

## Troubleshooting

- Cannot find module 'cors': run `npm install`
- Prisma version mismatch: update both `prisma` and `@prisma/client` to the same version
- DB schema not updated: run `npx prisma db push`
- 401 on tasks: ensure you send `Authorization: Bearer <token>` from login/register

## License

MIT
