# Teste - Full Stack Application

A modern full-stack application with a clean architecture backend and frontend.

## Project Structure

```
teste/
├── backend/          # Fastify backend with Clean Architecture
├── frontend/         # Frontend application
├── docker-compose.yml
└── README.md
```

## Backend

The backend is built with:
- **Fastify**: High-performance web framework
- **TypeScript**: Full type safety
- **TypeORM**: ORM with PostgreSQL
- **Clean Architecture**: Separation of concerns with SOLID principles
- **Docker**: Containerized deployment

### Quick Start

Start the entire stack with Docker Compose:

```bash
docker-compose up -d
```

The backend API will be available at `http://localhost:3000`

### API Endpoints

- `GET /health` - Health check endpoint with database status

For detailed backend documentation, see [backend/README.md](backend/README.md)

## Development

### Prerequisites

- Node.js 20.x or higher
- Docker and Docker Compose
- PostgreSQL 15 (if running locally)

### Running Locally

#### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Docker Commands

Start all services:
```bash
docker-compose up -d
```

View logs:
```bash
docker-compose logs -f
```

Stop services:
```bash
docker-compose down
```

## Architecture

The backend follows Clean Architecture principles with clear separation between:
- **Domain**: Business entities and rules
- **Application**: Use cases and interfaces
- **Infrastructure**: External implementations (database, HTTP)
- **Presentation**: HTTP controllers and routes

## License

ISC
