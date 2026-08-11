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
- Prisma (ORM)
- MySQL
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

# Initialize database
npx prisma db push

# Start development
npm run dev:all      # Frontend (port 5173)
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
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── types/
│       └── utils/
├── prisma/           # Database schema
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
