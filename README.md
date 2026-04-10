# banking-transaction

## Project Overview

This repository contains a MERN-based assignment project focused on building a concurrent banking transaction backend.

The backend is designed with:

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- MVC architecture with service and repository layers
- Request validation using `express-validator`
- Realtime notifications using Socket.IO
- Optimistic concurrency control for safe transaction handling

## Features

- Account creation and lookup
- Deposit, withdrawal, and transfer transactions
- Balance consistency under concurrent updates
- Realtime transaction and balance events
- Structured API responses
- Validation-driven request handling

## Repository Structure

- `backend/` - main backend implementation
- `MERN_Assignment.md` - original assignment brief

## Backend Setup

### Prerequisites

- Node.js 18+ recommended
- MongoDB connection string in `backend/.env`

### Install dependencies

```powershell
cd "backend"
npm install
```

### Environment configuration

Create or update `backend/.env` with:

```dotenv
PORT=5000
DATABASE_URL="your-mongodb-connection-string"
```

### Run in development

```powershell
npm run dev
```

### Build for production

```powershell
npm run build
```

### Start production build

```powershell
npm start
```

## Useful Scripts

- `npm run dev` - run the backend in watch mode
- `npm run build` - compile TypeScript
- `npm start` - run compiled output
- `npm run socket:test` - run the Socket.IO test client
- `npm run load:test` - run the k6 load test script
- `npm run load:test:1000` - run the 1000-concurrency k6 scenario

## Backend Documentation

- [Backend architecture](backend/docs/backend-architecture.md)
- [API reference](backend/docs/api-reference.md)
- [Realtime Socket.IO testing guide](backend/docs/realtime-socket-testing.md)
- [End-to-end test flow](backend/docs/end-to-end-test-flow.md)
- [Load testing report template](backend/docs/load-testing.md)

## Quick Verification Flow

1. Start the backend with `npm run dev`.
2. Start the Socket.IO test client with `npm run socket:test`.
3. Create an account.
4. Send a deposit, withdrawal, or transfer request.
5. Confirm realtime events appear in the socket client terminal.
