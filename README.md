# AI-Powered Exam Platform

An intelligent examination platform designed for Nigerian educational institutions, featuring AI-assisted grading, real-time monitoring, and comprehensive analytics.

## Features

- **Role-Based Dashboards**: Separate interfaces for Students, Teachers, and Admins
- **AI-Powered Grading**: Automated MCQ and descriptive answer evaluation using OpenAI
- **Real-Time Monitoring**: Live AI job tracking and notifications via WebSocket
- **Performance Analytics**: Detailed reports and trend analysis
- **Offline Support**: Exam draft autosave for unreliable connections
- **PDF Reports**: ETS-standard performance reports

## Tech Stack

### Frontend
- Next.js 14 (App Router) + TypeScript
- TailwindCSS + ShadCN UI
- Redux Toolkit + React Query
- Socket.IO Client
- Recharts + Framer Motion

### Backend
- Node.js 20 + Express + TypeScript
- PostgreSQL (via Sequelize ORM)
- Redis + BullMQ (job queues)
- Socket.IO (real-time)
- OpenAI API (GPT-4o-mini)

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker Desktop (for local development)
- OpenAI API key

## Quick Start

### 1. Clone and Install

```bash
cd "AI examiner"
pnpm install
```

### 2. Start Docker Services

```bash
pnpm docker:up
```

This starts PostgreSQL and Redis containers.

### 3. Configure Environment

Copy environment templates:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

Edit `backend/.env` and add your OpenAI API key.

### 4. Run Database Migrations

```bash
cd backend
pnpm migrate
```

### 5. Start Development Servers

```bash
# From root directory
pnpm dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Project Structure

```
ai-exam-platform/
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/          # App router pages
│   │   ├── components/   # Reusable components
│   │   ├── lib/          # Utilities and configs
│   │   └── store/        # Redux store
│   └── package.json
├── backend/              # Express API
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── services/     # Business logic
│   │   ├── models/       # Database models
│   │   ├── middleware/   # Auth, validation, etc.
│   │   ├── queues/       # BullMQ workers
│   │   └── sockets/      # Socket.IO handlers
│   └── package.json
├── docker-compose.yml    # Local development stack
└── package.json          # Workspace root
```

## Available Scripts

```bash
pnpm dev          # Start both frontend and backend
pnpm build        # Build for production
pnpm test         # Run all tests
pnpm lint         # Lint all code
pnpm format       # Format with Prettier
pnpm docker:up    # Start Docker services
pnpm docker:down  # Stop Docker services
```

## Default Credentials (Development)

After running migrations, use these credentials:

**Admin**
- Email: admin@example.com
- Password: Admin@123

**Teacher**
- Email: teacher@example.com
- Password: Teacher@123

**Student**
- Email: student@example.com
- Password: Student@123

## Documentation

- [Frontend Implementation Plan](./frontend_implementation_plan.md)
- [Backend Implementation Plan](./backend_implementation_plan.md)
- [Admin Frontend Plan](./admin_frontend_plan.md)
- [Admin Backend Plan](./admin_backend_plan.md)
- [Architecture Blueprint](./ai_exam_platform_blueprint.md)

## Deployment

### Railway Deployment (Recommended)

This project is configured for zero-error deployment on Railway.

**Quick Deploy:**
1. Push this repository to GitHub
2. Go to [Railway Dashboard](https://railway.app/dashboard)
3. Click "Deploy from GitHub repo"
4. Select this repository
5. Deploy backend folder → Add PostgreSQL → Add Redis
6. Deploy frontend folder
7. Add environment variables (see `RAILWAY_ZERO_ERRORS.md`)

**Complete Guide:** See `RAILWAY_ZERO_ERRORS.md` for step-by-step instructions.

**Time to Deploy:** ~20 minutes
**Cost:** Free tier available ($5-10/month for OpenAI)

### Environment Variables

**Backend Required:**
- `OPENAI_API_KEY` - Your OpenAI API key
- `JWT_SECRET` - Random 64-character string
- `JWT_REFRESH_SECRET` - Different random 64-character string
- Database & Redis variables (auto-filled by Railway)

**Frontend Required:**
- `NEXT_PUBLIC_API_URL` - Backend URL (auto-filled by Railway)

See `.env.example` files for complete list.

## Documentation

**Deployment:**
- [Railway Zero Errors Guide](./RAILWAY_ZERO_ERRORS.md) - Complete deployment guide
- [Deployment Ready](./DEPLOYMENT_READY.md) - Your credentials & quick start
- [Verified Ready](./VERIFIED_READY.md) - Deployment verification

**Project:**
- [Project Roadmap](./PROJECT_ROADMAP.md) - Complete project overview
- [Upload to GitHub](./UPLOAD_TO_GITHUB.md) - GitHub setup guide

## Support

For deployment issues, see `RAILWAY_ZERO_ERRORS.md` which covers all common errors and solutions.

## License

MIT License - See LICENSE file for details
