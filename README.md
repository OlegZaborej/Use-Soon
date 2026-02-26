# Smart Pantry & Freezer Manager (MVP)

## Stack
- Backend: NestJS + Prisma + PostgreSQL + JWT + Cron
- Frontend: Vue 3 + Vite + Pinia + Vue Router + Tailwind + PWA

## Run PostgreSQL
```bash
docker compose up -d postgres
```

## Backend
```bash
cd backend
cp ../.env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Frontend
```bash
cd frontend
cp ../.env.example .env
npm install
npm run dev
```

## Env
- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`
- `APP_TIMEZONE` (optional)
- `VITE_API_BASE_URL`

## Useful scripts
- Root: `npm run install`, `npm run dev`, `npm run build`, `npm run prisma:migrate`, `npm run prisma:seed`
- Backend: `npm run dev`, `npm run build`, `npm run prisma:migrate`, `npm run prisma:seed`
- Frontend: `npm run dev`, `npm run build`
