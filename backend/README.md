# Backend - Fastify with Clean Architecture

A modern, scalable backend application built with Fastify, TypeScript, TypeORM, and PostgreSQL following Clean Architecture principles and SOLID design patterns.

## Architecture

This project implements Clean Architecture with clear separation of concerns across four main layers:

### Layers

1. **Domain Layer** (`src/domain/`)
   - Contains business entities and rules
   - Framework-agnostic and independent of external concerns
   - Pure TypeScript classes without external dependencies

2. **Application Layer** (`src/application/`)
   - Defines use cases (business logic operations)
   - Contains port interfaces (repository contracts)
   - Orchestrates domain entities to fulfill business requirements

3. **Infrastructure Layer** (`src/infrastructure/`)
   - Implements external concerns (database, HTTP server)
   - Contains concrete implementations of repository interfaces
   - Manages TypeORM configuration and database connections

4. **Presentation Layer** (`src/presentation/`)
   - Handles HTTP concerns (controllers, routes, DTOs)
   - Transforms HTTP requests into use case calls
   - Returns properly formatted HTTP responses

## Project Structure

```
backend/
├── src/
│   ├── domain/              # Business entities
│   │   └── entities/
│   ├── application/         # Use cases & interfaces
│   │   ├── useCases/
│   │   └── ports/
│   ├── infrastructure/      # External implementations
│   │   ├── database/
│   │   ├── repositories/
│   │   └── http/
│   ├── presentation/        # HTTP layer
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── dtos/
│   ├── shared/             # Shared utilities
│   │   ├── config/
│   │   └── types/
│   └── server.ts           # Application entry point
├── tests/                  # Test files
├── Dockerfile
├── package.json
└── tsconfig.json
```

## Features

- ✅ **Clean Architecture**: Clear separation of concerns with dependency inversion
- ✅ **SOLID Principles**: Single responsibility, dependency injection, interface segregation
- ✅ **TypeScript**: Full type safety with strict mode enabled
- ✅ **Fastify**: High-performance web framework
- ✅ **TypeORM**: Powerful ORM with PostgreSQL support
- ✅ **Docker**: Containerized application with multi-stage builds
- ✅ **Testing**: Jest setup with unit tests
- ✅ **Security**: Helmet and CORS configured
- ✅ **Health Check**: Database connectivity monitoring

## Prerequisites

- Node.js 20.x or higher
- Docker and Docker Compose
- PostgreSQL 15 (if running locally without Docker)

## Installation

### Using Docker (Recommended)

1. Clone the repository and navigate to the project root:
```bash
cd teste
```

2. Start the application with Docker Compose:
```bash
docker-compose up -d
```

The application will be available at `http://localhost:3000`

### Local Development

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration

5. Start PostgreSQL (if not using Docker)

6. Run the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
NODE_ENV=development
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=app_db
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## API Endpoints

### Health Check

Check the application and database health status.

**Endpoint:** `GET /health`

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 45000,
  "database": {
    "connected": true,
    "message": "Database is connected"
  }
}
```

**Response (503 Service Unavailable):**
```json
{
  "status": "unhealthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 45000,
  "database": {
    "connected": false,
    "message": "Database connection failed"
  }
}
```

## Docker Commands

### Build and start services:
```bash
docker-compose up -d
```

### View logs:
```bash
docker-compose logs -f app
```

### Stop services:
```bash
docker-compose down
```

### Rebuild after code changes:
```bash
docker-compose up -d --build
```

### Remove volumes (clean database):
```bash
docker-compose down -v
```

## Testing

The project uses Jest for testing with ts-jest preset.

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Design Patterns

### Dependency Injection
Controllers and use cases receive dependencies through constructors, making the code testable and following the Dependency Inversion Principle.

### Repository Pattern
Database access is abstracted through repository interfaces defined in the application layer, with concrete implementations in the infrastructure layer.

### Use Case Pattern
Each use case encapsulates a single business operation, promoting the Single Responsibility Principle.

## Adding New Features

To add a new feature following Clean Architecture:

1. **Define the entity** in `src/domain/entities/` (if needed)
2. **Create repository interface** in `src/application/ports/`
3. **Implement use case** in `src/application/useCases/`
4. **Implement repository** in `src/infrastructure/repositories/`
5. **Create controller** in `src/presentation/controllers/`
6. **Define routes** in `src/presentation/routes/`
7. **Register in server.ts** with proper dependency injection

## Contributing

1. Follow the existing architecture patterns
2. Write tests for new features
3. Ensure TypeScript strict mode compliance
4. Update documentation as needed

## License

ISC

