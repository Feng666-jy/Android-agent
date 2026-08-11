# Android Agent

Enterprise AI Development Platform built with Vue3 + Express + Prisma.

## Tech Stack

### Frontend
- Vue 3 + Composition API
- TypeScript
- Vite
- Pinia (State Management)
- Vue Router
- Vant (UI Library)
- SCSS

### Backend
- Node.js + Express
- TypeScript
- node:sqlite (built-in SQLite driver, zero native deps)
- JWT Authentication
- Zod (Validation)

## Quick Start

### Prerequisites
- Node.js >= 18
- MySQL >= 8.0

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env .env.local
# Edit .env.local with your database credentials

# Init database (drops and recreates)
npm run db:init
# Apply incremental migrations (new tables/columns, non-destructive)
npm run db:migrate
# Seed demo data (admin/admin123, demo/test123)
npm run db:seed

# Start development
npm run dev      # Frontend (port 5173)
npm run server   # Backend (port 3000)
```

### Docker

```bash
cd docker
docker compose up -d
```

## Project Structure

```
├── src/              # Frontend source
│   ├── api/          # API modules
│   ├── components/   # Reusable components
│   ├── composables/  # Composition functions
│   ├── layouts/      # Layout components
│   ├── router/       # Vue Router config
│   ├── stores/       # Pinia stores
│   ├── styles/       # SCSS variables & mixins
│   ├── types/        # TypeScript types
│   ├── utils/        # Utility functions
│   └── views/        # Page views
├── server/           # Backend source
│   └── src/
│       ├── controllers/
│       ├── db/        # SQLite data layer (schema / fieldmaps / query builder / facade)
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── types/
│       └── utils/
├── scripts/           # db:init / db:seed scripts
└── docker/           # Docker configuration
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/user/register | No | User registration |
| POST | /api/user/login | No | User login |
| GET | /api/user/info | Yes | Get user info |
| PUT | /api/user/profile | Yes | Update profile |

## License

MIT
