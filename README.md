# Buyosphere

**Live demo:** https://mern-ecom-frontend-ruddy.vercel.app

A full-stack fashion e-commerce platform built with the MERN stack and TypeScript. Shoppers can browse and search products, save a wishlist, check out with Stripe and track their orders. Admins get a panel to manage products, orders and customers, with analytics charts.

## Features

**Shopping**
- Browse products by category (Men, Women, Kids, Ethnic, Western, Accessories, Footwear, Sale)
- Pinterest-style masonry product grid
- Search with category, price and sort filters, and a 300ms debounce
- Product detail page with reviews and star ratings
- Wishlist, saved to the database for each user
- Recently viewed products, saved in localStorage
- Shopping cart and Stripe checkout
- Order tracking with a status stepper

**Accounts**
- Google Sign-In with Firebase Authentication

**Admin panel**
- Manage products, orders and customers
- Analytics charts

## Tech stack

**Frontend**
- React 18, TypeScript, Vite
- Redux Toolkit and RTK Query
- React Router, Axios
- Firebase Authentication (Google OAuth)
- Stripe (`@stripe/react-stripe-js`)
- Ant Design, Chart.js, React Hot Toast
- SCSS

**Backend**
- Node.js, Express, TypeScript
- MongoDB with Mongoose
- Zod for request validation
- Stripe, including webhooks
- Helmet and express-rate-limit for security
- node-cache for caching

## Project structure

```
├── mern-ecom-frontend/   Vite, React and TypeScript
│   ├── src/
│   │   ├── components/   Header, Footer, ProductCard, Loader and more
│   │   ├── pages/        Home, Search, ProductDetail, Cart, Orders and more
│   │   ├── redux/        Store, RTK Query APIs, reducers
│   │   ├── styles/       SCSS design tokens and component styles
│   │   └── config/       Environment variable validation
│   └── vercel.json
│
└── mern-ecom-backend/    Express and TypeScript
    └── src/
        ├── routes/       user, product, order, payment, review, wishlist
        ├── models/       Mongoose schemas
        ├── controllers/  Route handlers
        ├── middlewares/  Auth, error handling, multer
        └── utils/        DB connection, cache, helpers
```

## Getting started

### Prerequisites

- Node.js 18 or later
- MongoDB running locally, or a MongoDB Atlas connection string
- A Stripe account (test mode) and a Firebase project

### 1. Backend

```bash
cd mern-ecom-backend
npm install
npm run dev
```

### 2. Frontend

```bash
cd mern-ecom-frontend
npm install
npm run dev
```

The app runs at http://localhost:5173 and the API at http://localhost:4000.

### 3. Seed the database (optional)

```bash
cd mern-ecom-backend
npx tsx src/seed.ts
```

This adds 29 sample fashion products across all categories.

## Environment variables

Create a `.env` file in each folder. Do not commit these files.

**Frontend** (`mern-ecom-frontend/.env`)

```
VITE_SERVER=http://localhost:4000
VITE_STRIPE_KEY=pk_test_...
VITE_FIREBASE_KEY=...
VITE_AUTH_DOMAIN=...
VITE_PROJECT_ID=...
VITE_STORAGE_BUCKET=...
VITE_MESSAGING_SENDER_ID=...
VITE_APP_ID=...
```

**Backend** (`mern-ecom-backend/.env`)

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/buyosphere
STRIPE_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=...
CLIENT_ORIGIN=http://localhost:5173
SERVER_DOMAIN=http://localhost:4000
PRODUCT_PER_PAGE=8
```

## Testing checkout

With Stripe in test mode, pay with the test card `4242 4242 4242 4242`, any future expiry date and any CVC. No real payment is made.

## Admin access

1. Sign in with Google.
2. Set your user's role to admin in MongoDB:

```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

3. Open the admin panel at `/admin/dashboard`.

## Security

- Request validation with Zod
- HTTP security headers with Helmet
- Rate limiting with express-rate-limit
- Admin pages and routes restricted by user role
- Secrets kept in environment variables, never in the repo
