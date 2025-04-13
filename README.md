# Reserva-Barber

Reserva-Barber is a comprehensive reservation and appointment management system designed for barber shops and similar service-based businesses. It is built with a robust Node.js and TypeScript stack, leveraging modern technologies such as Prisma, Docker, and Stripe to deliver a secure, scalable, and feature-rich platform.

---

## Overview

Reserva-Barber provides functionalities including:

- **User Authentication & Authorization**  
  Secure registration and login with JWT, supporting multiple roles (ADMIN, COMPANY_ADMIN, CLIENT, EMPLOYEE).

- **Company and Employee Management**  
  CRUD operations for companies and employees, enabling the management of business profiles and staff.

- **Appointment & Reservation Scheduling**  
  Create, update, list, and delete appointments and reservations with filtering options and user-based views.

- **Custom Scheduling Page**  
  An interactive, customizable scheduling page (with unique URL slugs) that allows users to book appointments online.

- **Payment Integration**  
  Seamless payment processing via Stripe with endpoints for creating payment intents, capturing payments, canceling transactions, and refund processing. This includes fraud detection, rate limiting, and security alerts.

- **Comprehensive Security Measures**  
  Multiple layers of security such as rate limiting, CSRF protection, SQL injection prevention, XSS prevention, and IP blocking using Redis.

- **Detailed API Documentation**  
  Auto-generated Swagger documentation is provided for all API endpoints.

- **Robust Testing**  
  Extensive integration and unit tests, powered by Jest and Supertest.

---

## Project Structure

- **Docker & Deployment**  
  - `docker-compose.yml`: Defines the services (app, Postgres, Redis) for containerized deployment.  
  - `Dockerfile`: Builds the application using the Node 18-alpine image.
  
- **Configuration Files**  
  - `.env.example`: Environment variable template (copy to `.env` and customize).  
  - `tsconfig.json`: TypeScript compiler configuration.
  
- **Source Code (`src/`)**  
  - **Entry Points**:  
    - `app.ts` & `server.ts`: Application setup and server startup.
  
  - **Modules** (`src/modules/`):  
    Implements domain features such as authentication, company management, employee operations, services, appointments, scheduling pages, payments, and dashboard functionalities.
  
  - **Middlewares** (`src/middlewares/`):  
    Implements security (CSRF, SQL injection prevention, XSS, rate limiting, etc.), validation (using Zod), and request sanitization.
  
  - **Entities** (`src/entities/`):  
    Contains domain models (e.g., User, Company, Appointment, etc.).
  
  - **Repositories** (`src/repositories/`):  
    Interfaces and Prisma-based implementations for data persistence.
  
  - **Services** (`src/services/`):  
    Business logic for tasks such as email notifications, payment processing, fraud detection, IP blocking, and security audits.
  
  - **Utilities** (`src/utils/`):  
    Functions for token handling, encryption, password hashing, and asynchronous error handling.
  
- **API Documentation**  
  - `docs/swagger.yaml`: The OpenAPI (Swagger) specification for documenting the API endpoints.
  
- **Tests** (`tests/`)  
  Contains extensive integration and unit tests to ensure functionality and reliability.

---

## Installation & Setup

### Prerequisites

- **Node.js** version 18 or later  
- **Docker & Docker Compose**  
- **PostgreSQL** (provided as a service via Docker)  
- **Redis** (provided as a service via Docker)

### Environment Variables

Create a `.env` file at the project root based on the `.env.example` template. For example:

```dotenv
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@postgres:5432/dbname?schema=public"
DB_USER=user
DB_PASSWORD=password
DB_NAME=dbname

# JWT & Security
JWT_SECRET=your_jwt_secret_key

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# SMTP / Email Settings (if applicable)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
EMAIL_FROM="No-Reply <no-reply@example.com>"

# Additional environment variables as needed...
