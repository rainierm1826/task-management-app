# Task Management Application

A full-stack task management application built with React, TypeScript, Vite, Express, Prisma, and PostgreSQL.

## Features

- Create tasks with a title and optional description
- Search tasks by title
- Filter tasks by active or completed status
- Edit task title, description, and status
- Mark tasks complete or active

## Requirements

### Docker (recommended)

- Docker Desktop with Docker Compose

### Local development

- Node.js 24 or newer
- npm
- PostgreSQL 18 or compatible PostgreSQL installation

## Run With Docker

From the project root, start the application:

```bash
docker compose up --build
```

Apply the Prisma migrations after the database is running:

```bash
docker compose exec backend npx prisma migrate deploy
```

Open the application at [http://localhost:5173](http://localhost:5173).

The services use these ports:

| Service                  | URL or port           |
| ------------------------ | --------------------- |
| Frontend                 | http://localhost:5173 |
| Backend API              | http://localhost:3000 |
| PostgreSQL from the host | localhost:5433        |

Stop the services with:

```bash
docker compose down
```

To also remove the PostgreSQL data volume:

```bash
docker compose down -v
```

## Run Locally

Start PostgreSQL and create a database named `task_manager`. The default connection string used by the backend is:

```text
postgresql://postgres:postgres@localhost:5433/task_manager
```

Create `backend/.env` with:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/task_manager"
```

Install dependencies and prepare the database:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
```

In a second terminal, start the backend:

```bash
cd backend
npm run dev
```

The frontend already includes `frontend/.env` with the local API URL. If it is missing, create it with:

```env
VITE_API_URL="http://localhost:3000"
```

Install and start the frontend in a third terminal:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Useful Commands

Run the frontend production build:

```bash
cd frontend
npm run build
```

Run frontend linting:

```bash
cd frontend
npm run lint
```

Inspect the database with Prisma Studio:

```bash
cd backend
npx prisma studio
```

## API Routes

| Method | Route           | Description                                                 |
| ------ | --------------- | ----------------------------------------------------------- |
| GET    | `/api/task`     | List tasks; supports `search` and `status` query parameters |
| POST   | `/api/task`     | Create a task                                               |
| PUT    | `/api/task/:id` | Update title, description, or completion status             |
| DELETE | `/api/task/:id` | Delete a task                                               |
