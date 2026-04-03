# Zorvyn Finance Data Processing and Access Control Backend

A clean backend assignment implementation using Node.js, Express, and MongoDB.

This project focuses on:

- Role-based access control (Viewer, Analyst, Admin)
- Financial records CRUD + filtering
- Dashboard summary APIs (totals, trends, recent activity)
- Validation, error handling, and reliable API behavior
- Clear architecture and maintainable code

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Zod for input validation
- JWT for authentication
- Helmet, CORS, and rate-limiting for API hardening

## Project Structure

```text
.
├── scripts
│   └── seed.js
├── src
│   ├── config
│   │   ├── db.js
│   │   └── env.js
│   ├── constants
│   │   └── roles.js
│   ├── controllers
│   │   ├── authController.js
│   │   ├── recordController.js
│   │   ├── summaryController.js
│   │   └── userController.js
│   ├── middleware
│   │   ├── auth.js
│   │   ├── authorize.js
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   └── validate.js
│   ├── models
│   │   ├── FinancialRecord.js
│   │   └── User.js
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── index.js
│   │   ├── recordRoutes.js
│   │   ├── summaryRoutes.js
│   │   └── userRoutes.js
│   ├── services
│   │   └── summaryService.js
│   ├── utils
│   │   ├── apiResponse.js
│   │   ├── appError.js
│   │   └── asyncHandler.js
│   ├── validators
│   │   ├── authValidators.js
│   │   ├── recordValidators.js
│   │   ├── summaryValidators.js
│   │   └── userValidators.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Update `.env` values if needed.

### 3. Run MongoDB locally

Make sure MongoDB is running at the URI used in `.env`.

### 4. Seed demo data

```bash
npm run seed
```

This creates:

- Admin: `admin@zorvyn.local / Admin@12345`
- Analyst: `analyst@zorvyn.local / Analyst@12345`
- Viewer: `viewer@zorvyn.local / Viewer@12345`

### 5. Start API

```bash
npm run dev
```

Base URL: `http://localhost:5001/api/v1`

Health check: `GET /api/v1/health`

## Role Model and Access Control

| Capability | Viewer | Analyst | Admin |
|---|---|---|---|
| Login | Yes | Yes | Yes |
| View own profile (`/auth/me`) | Yes | Yes | Yes |
| Read records | Yes | Yes | Yes |
| Create record | No | No | Yes |
| Update/Delete record | No | No | Yes |
| View dashboard summary | Yes | Yes | Yes |
| Manage users | No | No | Yes |

Access is enforced in backend middleware, not just by frontend assumptions.

## API Overview

### Auth

- `POST /auth/login`
  - Body: `{ "email": "...", "password": "..." }`
- `GET /auth/me`
  - Auth required

### Users (Admin only)

- `POST /users`
  - Create user with role/status
- `GET /users`
  - List users
- `PATCH /users/:id`
  - Update role/status/name

### Financial Records

- `GET /records` (Viewer/Analyst/Admin)
  - Supports query params: `page`, `limit`, `type`, `category`, `startDate`, `endDate`, `search`, `sortBy`, `sortOrder`
- `GET /records/:id` (Viewer/Analyst/Admin)
- `POST /records` (Admin only)
- `PATCH /records/:id` (Admin only)
- `DELETE /records/:id` (Admin only, soft delete)

### Dashboard Summary

- `GET /summary/overview`
  - Returns total income, total expense, net balance, category-wise totals
- `GET /summary/trends?mode=monthly&months=6`
  - Monthly or weekly trend points
- `GET /summary/recent?limit=5`
  - Recent activity

## Example Workflow

1. Login as admin:

```bash
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@zorvyn.local","password":"Admin@12345"}'
```

2. Use token from response:

```bash
export TOKEN="<paste_token_here>"
```

3. Create a record:

```bash
curl -X POST http://localhost:5001/api/v1/records \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":12000,"type":"income","category":"Bonus","date":"2026-03-01","notes":"Quarterly bonus"}'
```

4. Fetch dashboard overview:

```bash
curl http://localhost:5001/api/v1/summary/overview \
  -H "Authorization: Bearer $TOKEN"
```

## Validation and Error Handling

- All request payloads and key query/path params are validated with Zod
- Consistent JSON error format
- Correct status codes for auth failures, validation errors, not found, and conflicts
- Soft delete prevents accidental hard data loss for records

## Assumptions and Tradeoffs

- Authentication is JWT-based for simplicity and local development
- Password reset and refresh tokens are intentionally not implemented
- Soft delete is implemented for records; users are managed by status
- All records are globally visible to read roles in this assignment scenario

