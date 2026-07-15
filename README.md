# EdTech CRM

A MERN-style EdTech CRM MVP with a protected SaaS dashboard and working CRM modules for sales leads, student applications, HR candidates, billing, accounting, reports, and workspace settings.

## Overview

This project is now CRM-only. The root route sends users into the protected CRM workspace for sales, admissions, HR, billing, accounting, and reporting workflows.

The frontend is built with React, Vite, Tailwind CSS, Lucide icons, and React Router. The backend is built with Express, MongoDB, and Mongoose.

## Current Features

### Protected CRM Dashboard

- Protected `/dashboard` route using JWT authentication
- Sidebar navigation
- Top navbar with global search UI
- User role badge
- Dashboard stats cards
- Recent leads table
- Application review queue
- Revenue overview card
- Follow-up reminders card
- Recent activity timeline

### CRM Modules

- Sales Leads: create, view, edit, delete, filter, search, update status, and update notes.
- Applications: create, view, edit, delete, filter, status updates, and review workflow.
- Bulk Review: batch application review and bulk status changes.
- HR: candidate tracking, status management, interview scheduling, and bulk updates.
- Billing: invoice creation, payment tracking, payment status, and revenue summary.
- Accounting: invoice-backed ledger, recognized revenue, receivables, discounts, and tax overview.
- Reports: live cross-module reporting across leads, applications, HR, and billing.
- Settings: database-backed workspace preferences, notification toggles, user creation, role access matrix, and MVP readiness checklist.
- Logout: clears the JWT session and redirects to login.

## Tech Stack

### Frontend

- React 18
- Vite 6
- React Router 7
- Tailwind CSS 3
- Lucide React

### Backend

- Node.js
- Express 4
- MongoDB
- Mongoose
- CORS
- dotenv

## Project Structure

```text
.
|-- backend
|   |-- src
|   |   |-- config
|   |   |   `-- db.js
|   |   |-- controllers
|   |   |   |-- applicationController.js
|   |   |   |-- candidateController.js
|   |   |   |-- invoiceController.js
|   |   |   `-- leadController.js
|   |   |-- middleware
|   |   |   `-- requireDatabase.js
|   |   |-- models
|   |   |   |-- Application.js
|   |   |   |-- Candidate.js
|   |   |   |-- Invoice.js
|   |   |   `-- Lead.js
|   |   |-- routes
|   |   |   |-- applicationRoutes.js
|   |   |   |-- candidateRoutes.js
|   |   |   |-- invoiceRoutes.js
|   |   |   `-- leadRoutes.js
|   |   `-- server.js
|   |-- .env.example
|   `-- package.json
|-- src
|   |-- components
|   |   |-- dashboard
|   |-- pages
|   |   |-- dashboard
|   |-- services
|   |-- App.jsx
|   |-- main.jsx
|   `-- styles.css
|-- package.json
|-- tailwind.config.js
`-- vite.config.js
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- MongoDB connection string, either local MongoDB or MongoDB Atlas

### Install Dependencies

Install frontend/root dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
npm install
```

## Environment Variables

Create a backend environment file:

```bash
cp backend/.env.example backend/.env
```

On Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

Then update `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/edtech-crm
CLIENT_ORIGIN=http://127.0.0.1:5173
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=8h
ADMIN_NAME=Vishal Admin
ADMIN_EMAIL=admin@edtechcrm.local
ADMIN_PASSWORD=Admin123!
RATE_LIMIT_MAX=600
```

Use your own MongoDB URI for `MONGO_URI`. Do not commit `backend/.env`; it is intentionally ignored by Git.

## Running Locally

Start frontend and backend together:

```bash
npm run dev
```

Default local URLs:

- Frontend: `http://127.0.0.1:5173`
- Backend API: `http://127.0.0.1:5000`
- Health check: `http://127.0.0.1:5000/api/health`

Run only the frontend:

```bash
npm run dev:frontend
```

Run only the backend:

```bash
npm run dev:backend
```

Build the frontend:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Authentication

Authentication uses JWT tokens issued by the backend.

1. Open `http://127.0.0.1:5173/login`.
2. Sign in with a CRM user email and password.
3. The frontend stores the JWT token in local storage and sends it with API requests.
4. Open `/dashboard` or any dashboard module route.

On first backend startup, a default Super Admin is created if no users exist:

```text
Email: admin@edtechcrm.local
Password: Admin123!
```

Change these values in `backend/.env` before production use. Logout clears the local JWT session and redirects to `/login`.

## Seed Data

Seed an admin user and sample CRM records:

```bash
npm run seed
```

## Frontend Routes

### CRM Routes

- `/`
- `/login`
- `/dashboard`
- `/dashboard/sales-leads`
- `/dashboard/applications`
- `/dashboard/bulk-review`
- `/dashboard/hr`
- `/dashboard/billing`
- `/dashboard/accounting`
- `/dashboard/reports`
- `/dashboard/settings`
- `/dashboard/logout`

## API Endpoints

All module APIs use the `/api` prefix. CRM routes use database and JWT auth middleware.

### Health

```text
GET /api/health
```

### Leads

```text
GET    /api/leads/options
GET    /api/leads
POST   /api/leads
GET    /api/leads/:id
PUT    /api/leads/:id
DELETE /api/leads/:id
PATCH  /api/leads/:id/status
PATCH  /api/leads/:id/notes
```

### Auth and Users

```text
POST   /api/auth/login
GET    /api/auth/me
GET    /api/auth/users
POST   /api/auth/users
PUT    /api/auth/users/:id
```

User management routes require the `Super Admin` role.

### Settings

```text
GET    /api/settings
PUT    /api/settings
```

Updating workspace settings requires the `Super Admin` role.

### Global Search

```text
GET /api/search?search=query
```

Supported lead filters include:

- `status`
- `source`
- `search`
- `assignedCounselor`

### Applications

```text
GET    /api/applications/options
GET    /api/applications
POST   /api/applications
PATCH  /api/applications/bulk/status
GET    /api/applications/:id
PUT    /api/applications/:id
DELETE /api/applications/:id
PATCH  /api/applications/:id/status
```

### HR Candidates

```text
GET    /api/candidates/options
GET    /api/candidates
POST   /api/candidates
PATCH  /api/candidates/bulk/status
GET    /api/candidates/:id
PUT    /api/candidates/:id
DELETE /api/candidates/:id
PATCH  /api/candidates/:id/status
PATCH  /api/candidates/:id/interview
```

### Invoices

```text
GET    /api/invoices/options
GET    /api/invoices/stats/summary
GET    /api/invoices
POST   /api/invoices
GET    /api/invoices/:id
PUT    /api/invoices/:id
DELETE /api/invoices/:id
PATCH  /api/invoices/:id/payment
```

## Data Models

### Lead

Main fields:

- `name`
- `email`
- `phone`
- `courseInterested`
- `source`
- `status`
- `assignedCounselor`
- `followUpDate`
- `notes`
- `createdBy`
- `createdAt`
- `updatedAt`

Lead statuses:

- `New`
- `Contacted`
- `Demo Scheduled`
- `Converted`
- `Lost`

Lead sources:

- `Website`
- `Referral`
- `Instagram`
- `Facebook`
- `Google Ads`
- `Walk-in`
- `Other`

### Other Models

The backend also includes Mongoose models for:

- Student applications
- HR candidates
- Invoices

These models support the dashboard modules and reporting views.

## Development Notes

- The public landing website has been removed; the app is CRM-only.
- Vite proxies `/api` requests to `http://127.0.0.1:5000`.
- Frontend services live in `src/services`.
- Backend controllers, models, and routes follow a module-per-domain structure.
- Dashboard and APIs are protected by JWT authentication.
- Destructive/admin actions use basic role checks.
- `backend/.env` is ignored and must not be committed.

## Testing Checklist

After making changes, run:

```bash
npm run test
npm run build
```

Then start the full stack:

```bash
npm run dev
```

Verify:

- Root route `/` redirects into the CRM dashboard flow.
- Login page loads at `/login`.
- Dashboard opens after signing in with a valid CRM user.
- Sales Leads can create, edit, filter, and delete leads.
- Applications and Bulk Review flows load.
- HR candidate tracking loads.
- Billing can create invoices and record payments.
- Accounting and Reports show live module data.
- Settings save workspace preferences to MongoDB.
- Backend health check returns `{"status":"ok"}`.

## Troubleshooting

### Backend Cannot Connect to MongoDB

Check `backend/.env` and confirm `MONGO_URI` is valid.

### Frontend API Calls Fail

Confirm the backend is running on port `5000` and Vite proxy is active.

### Dashboard Redirects to Login

Open `/login` and sign in with a valid CRM user. If this is a fresh database, run the seed command or use the default first-run admin.

### Port Already in Use

Stop the process using port `5173` or `5000`, or update the relevant dev server configuration.

## Repository Hygiene

Do commit:

- Source files
- Models, controllers, routes, services, and UI modules
- `backend/.env.example`

Do not commit:

- `backend/.env`
- Local logs
- `node_modules`
- Build output unless intentionally needed

## Roadmap

- Add export functionality for accounting and reports.
- Add production deployment configuration.
- Add activity audit logs.
- Add notification and reminder scheduling.
