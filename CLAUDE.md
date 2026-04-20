# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ourBlooms is a full-stack flower e-commerce platform with:
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Express.js (Node.js 22) + Sequelize ORM + PostgreSQL
- **Payments**: Razorpay (primary), Stripe (international)
- **Auth**: JWT with HttpOnly refresh cookies + bcrypt
- **Images**: Cloudinary

## Commands

### Server (Backend)
```bash
cd server
npm run dev          # Start dev server with nodemon (port 3000)
npm run migrate      # Run Sequelize migrations
npm run seed         # Seed database (creates admin user)
npm run test         # Run Jest tests
```

### Client (Frontend)
```bash
cd client
npm run dev          # Start Vite dev server (port 5173)
npm run build        # Production build
npm run lint         # ESLint
```

## Architecture

### Backend Structure (`server/`)
```
server/
├── app.js              # Express setup, middleware, route mounting
├── server.js           # HTTP server entry point
├── config/             # Database, Cloudinary, Mailer, Razorpay configs
├── controllers/        # Request handlers (auth, products, orders, etc.)
├── middleware/         # auth.js (JWT), admin.js, errorHandler.js, upload.js
├── models/             # Sequelize models (User, Product, Order, etc.)
├── routes/             # API route definitions
├── services/           # Business logic (orderService, paymentService, emailService)
├── utils/              # apiResponse.js, logger.js, validators.js
└── migrations/         # Sequelize migrations
```

**Key patterns:**
- Routes → Controllers → Services → Models
- All API responses use `successResponse()` / `errorResponse()` from `utils/apiResponse.js`
- JWT verification in `middleware/auth.js`; admin routes use `middleware/admin.js`
- Refresh tokens stored in HttpOnly cookies (requires `cookie-parser` middleware)
- Rate limiting: 1000 auth requests/15min in dev, 5 in production

### Frontend Structure (`client/`)
```
client/src/
├── api/                # Axios instance + API modules (auth, products, cart, orders)
├── context/            # AuthContext.jsx, CartContext.jsx
├── hooks/              # useDebounce, useLocalStorage, useScrollTop, useProducts, useOrders
├── components/
│   ├── common/         # Button, Input, Select, Badge, Modal, Spinner, Toast, EmptyState
│   ├── layout/         # Navbar, Footer, Sidebar, PageLayout
│   ├── product/        # ProductCard, ProductGrid, ImageCarousel, ProductFilters
│   ├── cart/           # CartDrawer, CartItem, CartSummary, CartEmpty
│   ├── checkout/       # AddressForm, SlotPicker, PaymentButton, OrderSummary, CouponInput
│   └── admin/          # AdminSidebar, DashboardStats, OrderQueue, ProductForm, StockAlert
└── pages/              # Home, Shop, Cart, Checkout, Auth/*, Account/*, Admin/*
```

**Key patterns:**
- Server state: TanStack Query (React Query)
- Axios instance auto-attaches JWT from AuthContext
- Cart stored server-side in `carts` + `cart_items` tables
- Form validation: React Hook Form + Zod

## Data Model

Core tables (all use UUID primary keys):
- `users` - email, password_hash, name, role (customer/admin/driver), phone
- `products` - name, slug, description, price_paise, category_id, images[], stock_qty, is_seasonal
- `categories` - name, slug, description
- `orders` + `order_items` - status enum, total_paise, delivery_slot_id, payment_ref
- `carts` + `cart_items` - server-side persistent cart
- `addresses` - user addresses with default flag
- `delivery_slots` - date, time_window, max_orders
- `subscriptions` - frequency (weekly/fortnightly/monthly), pause/resume/cancel
- `coupons` - discount codes with expiry

## API Endpoints (`/api/v1/`)

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/auth/register` | POST | - | Create account |
| `/auth/login` | POST | - | Get tokens |
| `/auth/refresh` | POST | - | Refresh access token (uses cookie) |
| `/auth/logout` | POST | - | Clear refresh cookie |
| `/auth/me` | GET | Yes | Current user profile |
| `/products` | GET/POST | Admin for POST | List/Create products |
| `/cart` | GET/DELETE | Yes | Get/clear cart |
| `/cart/items` | POST | Yes | Add to cart |
| `/orders` | GET/POST | Yes | Order history / Create order |
| `/orders/:id/verify-payment` | POST | Yes | Verify Razorpay HMAC |
| `/subscriptions` | GET/POST | Yes | List / Create subscription |
| `/admin/*` | Various | Admin | Dashboard, products, orders, coupons, analytics |

## Environment Variables

### Server (`.env`)
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Client (`.env`)
```
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_RAZORPAY_KEY_ID=...
```

## Common Development Tasks

### Run migrations and seed
```bash
cd server
npm run migrate
npm run seed
```

### Add new API endpoint
1. Add route in `server/routes/*.routes.js`
2. Add controller in `server/controllers/*.js`
3. Add service logic in `server/services/*.js` if needed
4. Create frontend API module in `client/src/api/*.js`
5. Use React Query hook in component

### Add new model
1. Create model file in `server/models/`
2. Create migration: `npx sequelize-cli migration:generate --name <name>`
3. Define associations in `models/index.js`

## Notes

- Prices stored in **paise** (integer), divide by 100 for display
- All UUIDs generated via `crypto.randomUUID()` in seeders (not `Sequelize.UUIDV4`)
- Rate limiting disabled in development (1000 req/15min), strict in production (5 req/15min for auth)
- Cookie-parser middleware required for refresh token flow
