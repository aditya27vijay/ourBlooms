# ourBlooms

ourBlooms is a full-stack flower e-commerce platform with a React + Vite frontend and an Express + Sequelize backend.

## Project Overview

- **Frontend:** React 18, Vite, Tailwind CSS, React Router, TanStack Query, Axios
- **Backend:** Node.js, Express, Sequelize ORM, PostgreSQL
- **Auth:** JWT access tokens + HttpOnly refresh tokens
- **Payments:** Razorpay (primary), Stripe support possible
- **Images:** Cloudinary

## Repository Structure

```
ourBlooms/
├── client/          # Frontend application
├── server/          # Backend API server
├── CLAUDE.md        # Project guidance file
├── DEVELOPMENT_PLAN.md
├── prd.md
└── package.json     # Root package info (backend dependency shared)
```

### Frontend (`client/`)

- `src/main.jsx` - app bootstrap
- `src/App.jsx` - route definitions
- `src/api` - Axios setup and API modules
- `src/context` - Auth and Cart providers
- `src/hooks` - React Query hooks for products, cart, orders
- `src/components` - reusable UI components and page layouts
- `src/pages` - application pages

### Backend (`server/`)

- `app.js` - Express middleware and routes
- `server.js` - HTTP server entry
- `config/` - DB, Cloudinary, Razorpay, mailer config
- `controllers/` - request handlers
- `routes/` - API route definitions
- `models/` - Sequelize models
- `migrations/` - database schema migrations
- `seeders/` - initial seed data
- `middleware/` - auth, error handling, uploads
- `utils/` - shared helpers and response formatting

## Getting Started

### Prerequisites

- Node.js 22+
- npm
- PostgreSQL
- A Cloudinary account (for image upload if used)
- Razorpay credentials for payments

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
# then update .env with your database, JWT, Razorpay and Cloudinary values
npm run migrate
npm run seed
npm run dev
```

The backend runs on `http://localhost:3000` by default, with API routes under `/api/v1`.

### Frontend Setup

```bash
cd client
npm install
cp .env.example .env
# update VITE_API_BASE_URL if needed
npm run dev
```

The frontend runs on `http://localhost:5173` by default. If that port is already in use, Vite will choose the next free port.

## Environment Variables

### Backend `.env`

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRY`
- `JWT_REFRESH_EXPIRY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `CLIENT_ORIGIN`
- `NODE_ENV`

### Frontend `.env`

- `VITE_API_BASE_URL`
- `VITE_RAZORPAY_KEY_ID`

## Common Commands

### Backend

- `npm run dev` - start backend in development
- `npm run migrate` - run Sequelize migrations
- `npm run seed` - seed the database

### Frontend

- `npm run dev` - start Vite dev server
- `npm run build` - build production bundle
- `npm run lint` - run ESLint checks

## Notes

- Price values are stored in paise in the backend and converted to rupees in the frontend.
- The app uses server-side cart persistence and refresh tokens via HttpOnly cookies.
- If the frontend switches from `5173` to another port, open the actual Vite URL shown in the terminal.

## Helpful Tips

- Always start the backend first so the frontend API proxy and auth checks can connect.
- Clear `localStorage` and cookies if auth state becomes inconsistent during development.
- Use `npm run migrate` after changing models or migrations.
