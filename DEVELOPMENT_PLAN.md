# ourBlooms Development Plan

## Project Overview

A full-stack flower e-commerce web application built with React 18 (frontend), Express.js (backend), and PostgreSQL database.

---

## Complete File Structure

```
ourBlooms/
├── prd.md
├── DEVELOPMENT_PLAN.md
├── README.md
├── .gitignore
├── .env.example
│
├── server/                          # Backend (Express.js)
│   ├── package.json
│   ├── server.js                    # Entry point - HTTP server
│   ├── app.js                       # Express app setup, middleware, routes
│   │
│   ├── config/
│   │   ├── db.js                    # Sequelize connection
│   │   ├── cloudinary.js            # Cloudinary configuration
│   │   ├── mailer.js                # Nodemailer configuration
│   │   └── razorpay.js              # Razorpay SDK initialization
│   │
│   ├── controllers/
│   │   ├── authController.js        # Register, login, refresh, logout, me
│   │   ├── productController.js     # CRUD operations for products
│   │   ├── orderController.js       # Order creation, verification, status
│   │   ├── cartController.js        # Cart operations
│   │   ├── subscriptionController.js# Subscription management
│   │   ├── couponController.js      # Coupon validation
│   │   └── adminController.js       # Admin dashboard, analytics
│   │
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification, token refresh
│   │   ├── admin.js                 # isAdmin role check
│   │   ├── errorHandler.js          # Global error handler
│   │   └── upload.js                # Multer + Cloudinary upload
│   │
│   ├── models/
│   │   ├── index.js                 # Sequelize model associations
│   │   ├── User.js                  # User model with roles
│   │   ├── Product.js               # Product with seasonal flags
│   │   ├── Category.js              # Product categories
│   │   ├── Order.js                 # Order with status enum
│   │   ├── OrderItem.js             # Order line items
│   │   ├── Cart.js                  # Server-side cart
│   │   ├── CartItem.js              # Cart line items
│   │   ├── Address.js               # User saved addresses
│   │   ├── DeliverySlot.js          # Delivery time slots
│   │   ├── Subscription.js          # Recurring subscriptions
│   │   ├── Coupon.js                # Discount codes
│   │   └── Review.js                # Product reviews
│   │
│   ├── routes/
│   │   ├── index.js                 # Route aggregator
│   │   ├── auth.routes.js           # /auth/* endpoints
│   │   ├── product.routes.js        # /products/* endpoints
│   │   ├── cart.routes.js           # /cart/* endpoints
│   │   ├── order.routes.js          # /orders/* endpoints
│   │   ├── subscription.routes.js   # /subscriptions/* endpoints
│   │   ├── coupon.routes.js         # /coupons/* endpoints
│   │   └── admin.routes.js          # /admin/* endpoints
│   │
│   ├── services/
│   │   ├── orderService.js          # Order creation, stock decrement
│   │   ├── paymentService.js        # Razorpay verification, webhooks
│   │   ├── emailService.js          # Order confirmations, notifications
│   │   ├── stockService.js          # Inventory management
│   │   └── cronJobs.js              # Scheduled tasks (node-cron)
│   │
│   ├── utils/
│   │   ├── apiResponse.js           # Standardized response envelope
│   │   ├── validators.js            # express-validator schemas
│   │   ├── slugify.js               # URL-friendly slug generator
│   │   └── constants.js             # App constants (roles, statuses)
│   │
│   ├── migrations/
│   │   ├── 001-create-users.js
│   │   ├── 002-create-categories.js
│   │   ├── 003-create-products.js
│   │   ├── 004-create-addresses.js
│   │   ├── 005-create-delivery-slots.js
│   │   ├── 006-create-carts.js
│   │   ├── 007-create-cart-items.js
│   │   ├── 008-create-orders.js
│   │   ├── 009-create-order-items.js
│   │   ├── 010-create-subscriptions.js
│   │   ├── 011-create-coupons.js
│   │   └── 012-create-reviews.js
│   │
│   ├── seeders/
│   │   ├── 001-admin-user.js        # Default admin account
│   │   ├── 002-categories.js        # Initial categories
│   │   └── 003-sample-products.js   # Demo product catalog
│   │
│   └── .env.example
│
└── client/                          # Frontend (React 18 + Vite)
    ├── package.json
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    │
    ├── public/
    │   ├── favicon.ico
    │   └── robots.txt
    │
    ├── src/
    │   ├── main.jsx                 # React entry point
    │   ├── App.jsx                  # Root component with routing
    │   │
    │   ├── api/
    │   │   ├── axios.js             # Axios instance with interceptors
    │   │   ├── products.js          # Product API calls
    │   │   ├── cart.js              # Cart API calls
    │   │   ├── orders.js            # Order API calls
    │   │   ├── subscriptions.js     # Subscription API calls
    │   │   └── auth.js              # Auth API calls
    │   │
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Button.jsx
    │   │   │   ├── Input.jsx
    │   │   │   ├── Select.jsx
    │   │   │   ├── Badge.jsx
    │   │   │   ├── Modal.jsx
    │   │   │   ├── Spinner.jsx
    │   │   │   ├── Toast.jsx
    │   │   │   └── EmptyState.jsx
    │   │   │
    │   │   ├── layout/
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   ├── Sidebar.jsx
    │   │   │   └── PageLayout.jsx
    │   │   │
    │   │   ├── product/
    │   │   │   ├── ProductCard.jsx
    │   │   │   ├── ProductGrid.jsx
    │   │   │   ├── ProductDetail.jsx
    │   │   │   ├── ImageCarousel.jsx
    │   │   │   ├── ProductFilters.jsx
    │   │   │   └── SeasonalBadge.jsx
    │   │   │
    │   │   ├── cart/
    │   │   │   ├── CartDrawer.jsx
    │   │   │   ├── CartItem.jsx
    │   │   │   ├── CartSummary.jsx
    │   │   │   └── CartEmpty.jsx
    │   │   │
    │   │   ├── checkout/
    │   │   │   ├── AddressForm.jsx
    │   │   │   ├── SlotPicker.jsx
    │   │   │   ├── PaymentButton.jsx
    │   │   │   ├── OrderSummary.jsx
    │   │   │   └── CouponInput.jsx
    │   │   │
    │   │   └── admin/
    │   │       ├── AdminSidebar.jsx
    │   │       ├── DashboardStats.jsx
    │   │       ├── OrderQueue.jsx
    │   │       ├── ProductForm.jsx
    │   │       └── StockAlert.jsx
    │   │
    │   ├── context/
    │   │   ├── AuthContext.jsx      # Auth state + JWT handling
    │   │   └── CartContext.jsx      # Cart state management
    │   │
    │   ├── hooks/
    │   │   ├── useDebounce.js
    │   │   ├── useLocalStorage.js
    │   │   ├── useScrollTop.js
    │   │   ├── useProducts.js       # React Query for products
    │   │   ├── useCart.js           # React Query for cart
    │   │   └── useOrders.js         # React Query for orders
    │   │
    │   ├── pages/
    │   │   ├── Home.jsx             # Landing page
    │   │   ├── Shop.jsx             # Product catalog with filters
    │   │   ├── ProductDetail.jsx    # Single product view
    │   │   ├── Cart.jsx             # Cart page
    │   │   ├── Checkout.jsx         # Checkout flow
    │   │   ├── OrderSuccess.jsx     # Post-order confirmation
    │   │   ├── Account/
    │   │   │   ├── Profile.jsx
    │   │   │   ├── OrderHistory.jsx
    │   │   │   ├── OrderDetail.jsx
    │   │   │   ├── Addresses.jsx
    │   │   │   └── Subscriptions.jsx
    │   │   ├── Auth/
    │   │   │   ├── Login.jsx
    │   │   │   ├── Register.jsx
    │   │   │   └── ForgotPassword.jsx
    │   │   └── Admin/
    │   │       ├── Dashboard.jsx
    │   │       ├── Products.jsx
    │   │       ├── Orders.jsx
    │   │       ├── Coupons.jsx
    │   │       └── Analytics.jsx
    │   │
    │   ├── utils/
    │   │   ├── formatPrice.js       # Paise to rupees formatter
    │   │   ├── dateHelpers.js       # Date formatting utilities
    │   │   ├── validators.js        # Form validation schemas (Zod)
    │   │   └── constants.js         # Frontend constants
    │   │
    │   ├── assets/
    │   │   ├── images/
    │   │   └── icons/
    │   │
    │   └── styles/
    │       ├── index.css            # Tailwind imports + custom styles
    │       └── floral-theme.css     # Custom design tokens
    │
    └── .env.example
```

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)

**Goal:** Project scaffolding, database schema, authentication

#### Backend Tasks
- [ ] Initialize Node.js project with ES modules
- [ ] Set up Express app structure (app.js, server.js)
- [ ] Configure Sequelize with PostgreSQL
- [ ] Create database migrations (001-003: users, categories, products)
- [ ] Implement JWT authentication (register, login, refresh)
- [ ] Set up Cloudinary for image storage
- [ ] Configure Winston logging

#### Frontend Tasks
- [ ] Initialize Vite + React 18 project
- [ ] Configure Tailwind CSS with floral design tokens
- [ ] Set up React Router v6
- [ ] Create AuthContext with JWT handling
- [ ] Build Login and Register pages
- [ ] Create base layout components (Navbar, Footer)

#### Deliverables
- Working authentication flow
- Database with core tables
- Basic UI shell

---

### Phase 2: Catalog (Weeks 3-4)

**Goal:** Product management and browsing

#### Backend Tasks
- [ ] Product CRUD endpoints (admin only)
- [ ] Product listing with pagination, filters, search
- [ ] Image upload middleware with Cloudinary
- [ ] Category management
- [ ] Slug generation utility
- [ ] Seed sample products

#### Frontend Tasks
- [ ] Shop page with filter sidebar
- [ ] ProductCard and ProductGrid components
- [ ] ProductDetail page with image carousel
- [ ] Search with debounced input
- [ ] Related products row
- [ ] Seasonal availability badges

#### Deliverables
- Browseable product catalog
- Admin product management
- Search and filter functionality

---

### Phase 3: Commerce (Weeks 5-6)

**Goal:** Cart, checkout, and order processing

#### Backend Tasks
- [ ] Server-side cart endpoints
- [ ] Delivery slot system (create, list, capacity check)
- [ ] Order creation with stock validation
- [ ] Razorpay integration (checkout + webhook)
- [ ] Order confirmation email service
- [ ] Stock decrement on payment
- [ ] Cart cleanup cron job

#### Frontend Tasks
- [ ] CartContext with server sync
- [ ] CartDrawer and CartItem components
- [ ] Checkout flow (address, slot, payment)
- [ ] SlotPicker component
- [ ] Razorpay modal integration
- [ ] OrderSuccess page
- [ ] OrderHistory page

#### Deliverables
- Complete purchase flow
- Payment integration
- Order management

---

### Phase 4: Admin (Week 7)

**Goal:** Admin panel for shop management

#### Backend Tasks
- [ ] Admin dashboard endpoints (stats, analytics)
- [ ] Order queue with status updates
- [ ] Coupon CRUD and validation
- [ ] Low-stock alerts
- [ ] Driver role endpoints

#### Frontend Tasks
- [ ] Admin dashboard layout
- [ ] DashboardStats component
- [ ] OrderQueue management UI
- [ ] ProductForm for admin editing
- [ ] Coupon management page
- [ ] Analytics chart (Chart.js)

#### Deliverables
- Admin dashboard
- Order management
- Coupon system

---

### Phase 5: Subscriptions (Week 8)

**Goal:** Recurring flower delivery subscriptions

#### Backend Tasks
- [ ] Subscription model and endpoints
- [ ] Pause/resume/cancel logic
- [ ] Recurring order cron job
- [ ] Subscription webhooks

#### Frontend Tasks
- [ ] Subscription creation flow
- [ ] User subscription management page
- [ ] Pause/resume controls

#### Deliverables
- Working subscription system
- Recurring order automation

---

### Phase 6: Polish (Weeks 9-10)

**Goal:** Production readiness

#### Tasks
- [ ] Performance audit (Lighthouse)
- [ ] Mobile responsiveness QA
- [ ] Error boundaries in React
- [ ] 404 and 500 pages
- [ ] Security hardening (headers, rate limiting)
- [ ] Environment configuration
- [ ] Staging deployment
- [ ] UAT and bug fixes

#### Deliverables
- Production-ready application
- Deployed on Vercel (frontend) + Render/Railway (backend)

---

## Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ourblooms

# JWT
JWT_SECRET=your-32-char-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=your-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# CORS
CLIENT_ORIGIN=http://localhost:5173

# Cut-off time (IST)
SLOT_CUTOFF_HOUR=11
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_RAZORPAY_KEY_ID=rzp_test_xxx
```

---

## Database Schema Summary

| Table | Purpose | Key Fields |
|-------|---------|------------|
| users | User accounts | email, password_hash, role |
| categories | Product categories | name, slug |
| products | Flower products | name, slug, price_paise, stock_qty, is_seasonal |
| addresses | User addresses | user_id, street, city, pincode, is_default |
| delivery_slots | Available slots | date, time_window, max_orders, booked |
| carts | User carts | user_id, total_paise |
| cart_items | Cart line items | cart_id, product_id, quantity |
| orders | Customer orders | user_id, status, total_paise, payment_ref |
| order_items | Order line items | order_id, product_id, quantity, price |
| subscriptions | Recurring orders | user_id, frequency, next_delivery, status |
| coupons | Discount codes | code, discount_type, value, expires_at |
| reviews | Product reviews | user_id, product_id, rating, comment |

---

## API Endpoints Summary

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/register | Create account |
| POST | /api/v1/auth/login | Login |
| POST | /api/v1/auth/refresh | Refresh token |
| POST | /api/v1/auth/logout | Logout |
| GET | /api/v1/auth/me | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/products | List products |
| GET | /api/v1/products/:slug | Product detail |
| POST | /api/v1/products | Create (admin) |
| PUT | /api/v1/products/:id | Update (admin) |
| DELETE | /api/v1/products/:id | Delete (admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/cart | Get cart |
| POST | /api/v1/cart/items | Add item |
| PUT | /api/v1/cart/items/:id | Update quantity |
| DELETE | /api/v1/cart | Clear cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/orders/checkout | Create order |
| POST | /api/v1/orders/verify-payment | Verify payment |
| GET | /api/v1/orders | Order history |
| GET | /api/v1/orders/:id | Order detail |
| PUT | /api/v1/orders/:id/status | Update status (admin) |

### Subscriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/subscriptions | Create subscription |
| GET | /api/v1/subscriptions | List subscriptions |
| PUT | /api/v1/subscriptions/:id/pause | Pause |
| PUT | /api/v1/subscriptions/:id/resume | Resume |
| DELETE | /api/v1/subscriptions/:id | Cancel |

---

## Key Technical Decisions

1. **Server-side cart** - Prevents cart abandonment data loss, enables stock reservation
2. **UUID primary keys** - Avoids ID enumeration attacks, better for distributed systems
3. **Paise storage** - Integer math avoids floating-point precision issues
4. **HttpOnly refresh cookies** - More secure than localStorage for tokens
5. **Sequelize ORM** - Parameterized queries prevent SQL injection
6. **Cloudinary** - Offloads image storage, provides transformations

---

## Next Steps

1. Initialize git repository
2. Create backend scaffold (server/)
3. Create frontend scaffold (client/)
4. Set up PostgreSQL database
5. Begin Phase 1 implementation
