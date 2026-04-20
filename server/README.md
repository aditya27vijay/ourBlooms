# ourBlooms Backend

Express.js backend API for the ourBlooms flower e-commerce platform.

## Features

- User authentication with JWT
- Product catalog management
- Shopping cart functionality
- Order processing with Razorpay integration
- Admin panel for shop management
- Subscription system
- Image upload with Cloudinary
- Email notifications

## Tech Stack

- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js 4
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT with bcrypt
- **Payments**: Razorpay
- **File Storage**: Cloudinary
- **Email**: Nodemailer with SMTP

## Getting Started

### Prerequisites

- Node.js 20 LTS
- PostgreSQL database
- Razorpay account
- Cloudinary account
- SMTP email service

### Installation

1. Clone the repository
2. Navigate to the server directory
3. Install dependencies:
   ```bash
   npm install
   ```

4. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

5. Update `.env` with your configuration

6. Set up the database:
   ```bash
   npm run migrate
   npm run seed
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user profile

### Product Endpoints
- `GET /products` - List products with filters
- `GET /products/:slug` - Get single product
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

### Cart Endpoints
- `GET /cart` - Get user's cart
- `POST /cart/items` - Add item to cart
- `PUT /cart/items/:id` - Update cart item
- `DELETE /cart` - Clear cart

### Order Endpoints
- `POST /orders/checkout` - Create order
- `POST /orders/verify-payment` - Verify payment
- `GET /orders` - Get user's orders
- `GET /orders/:id` - Get single order

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data

## Project Structure

```
server/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Express middleware
├── models/          # Sequelize models
├── routes/          # API routes
├── services/        # Business logic services
├── utils/           # Utility functions
├── migrations/      # Database migrations
├── seeders/         # Database seeders
├── logs/            # Application logs
└── app.js           # Express app setup
```

## Environment Variables

See `.env.example` for all required environment variables.

## License

MIT