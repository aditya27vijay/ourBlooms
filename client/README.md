# ourBlooms Client

React 18 frontend for the ourBlooms flower e-commerce platform.

## Tech Stack

- **Framework:** React 18 with Vite
- **Routing:** React Router v6
- **State Management:** Context API + useReducer (Auth, Cart)
- **Server State:** TanStack Query (React Query)
- **HTTP Client:** Axios
- **Forms:** React Hook Form + Zod validation
- **Styling:** Tailwind CSS
- **Charts:** Chart.js + react-chartjs-2
- **Payments:** Razorpay SDK

## Getting Started

### Prerequisites

- Node.js 20 LTS
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your configuration
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

### Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

### Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
npm run lint
```

## Project Structure

```
client/
├── src/
│   ├── api/              # API client modules
│   ├── components/       # Reusable components
│   │   ├── common/       # Shared UI components
│   │   ├── layout/       # Layout components
│   │   ├── product/      # Product-related components
│   │   ├── cart/         # Cart components
│   │   ├── checkout/     # Checkout components
│   │   └── admin/        # Admin panel components
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── styles/           # CSS styles
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Root app component
│   └── main.jsx          # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── .env.example
```

## Key Features

- **Product Catalog:** Browse, search, and filter flowers
- **Shopping Cart:** Server-side cart with real-time sync
- **Checkout:** Multi-step checkout with address and delivery slot selection
- **User Accounts:** Profile management, order history, saved addresses
- **Subscriptions:** Recurring flower delivery subscriptions
- **Admin Panel:** Product management, order queue, analytics

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API URL |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key |

## Design System

### Colors

- **Primary:** Pink/Rose shades (primary-50 to primary-900)
- **Secondary:** Green/Sage shades (secondary-50 to secondary-900)
- **Floral:** Custom floral accent colors (cream, blush, sage, lavender, coral, burgundy)

### Typography

- **Display:** Playfair Display (headings)
- **Body:** Inter (content)

### Components

- Button (variants: primary, secondary, outline, ghost, danger)
- Input, Select
- Badge, Modal, Spinner, Toast
- EmptyState
- Card, Navbar, Footer, Sidebar
