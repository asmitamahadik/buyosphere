# Buyosphere

A full-stack fashion e-commerce platform built with the MERN stack.

## Tech Stack

**Frontend**
- React 18 + TypeScript (Vite)
- Redux Toolkit + RTK Query
- Firebase Authentication (Google OAuth)
- Stripe Payments
- SCSS

**Backend**
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Zod validation
- Stripe webhooks
- Helmet + rate limiting

## Features

- Browse fashion products by category (Men, Women, Kids, Ethnic, Western, Accessories, Footwear, Sale)
- Pinterest-style masonry product grid
- Product search with filters (category, price, sort) and 300ms debounce
- Product detail page with reviews and star ratings
- Wishlist (persisted to database per user)
- Recently viewed products (persisted to localStorage)
- Shopping cart + Stripe checkout
- Order tracking with status stepper
- Google Sign-In with Firebase
- Admin panel: manage products, orders, customers, analytics charts

## Project Structure

```
├── mern-ecom-frontend/   # Vite + React + TypeScript
│   ├── src/
│   │   ├── components/   # Header, Footer, ProductCard, Loader ...
│   │   ├── pages/        # Home, Search, ProductDetail, Cart, Orders ...
│   │   ├── redux/        # Store, RTK Query APIs, reducers
│   │   ├── styles/       # SCSS design tokens and component styles
│   │   └── config/       # Environment variable validation
│   └── vercel.json
│
└── mern-ecom-backend/    # Express + TypeScript
    └── src/
        ├── routes/       # user, product, order, payment, review, wishlist
        ├── models/       # Mongoose schemas
        ├── controllers/  # Route handlers
        ├── middlewares/  # Auth, error, multer
        └── utils/        # DB connection, cache, helpers
```

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI

### Backend

```bash
cd mern-ecom-backend
npm install
npm run dev
```

### Frontend

```bash
cd mern-ecom-frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`, backend at `http://localhost:4000`.

### Seed the database

```bash
cd mern-ecom-backend
npx tsx src/seed.ts
```

Inserts 29 sample fashion products across all categories.

## Environment Variables

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

## Admin Access

After signing in with Google, set your user role to admin in MongoDB:

```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

Then access the admin panel at `/admin/dashboard`.
