# Stock Market Analyser

Full-stack stock market analyzer with separate Company and Buyer dashboards, MongoDB persistence, role-based JWT auth, stock CRUD, purchasing workflow, and analytics charts.

## Tech Stack
- Frontend: React + Vite + Recharts
- Backend: Node.js + Express + Mongoose
- DB: MongoDB
- Auth: JWT + bcrypt password hashing

## Folder Structure
- `backend`: API server, models, business logic
- `frontend`: React client with role-based dashboards

## Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Required env vars:
- `MONGO_URI`
- `JWT_SECRET`
- `PORT` (optional, default 5000)

## Frontend Setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend env vars:
- `VITE_API_URL` (e.g. `http://localhost:5000/api`)

## Implemented Features
- Separate signup/login endpoints for Company and Buyer.
- Password hashing with bcrypt and JWT issuance.
- Role-based authorization middleware.
- Company stock CRUD.
- Buyer stock search/filter, company stock details page, stock purchase flow.
- MongoDB `transactions` collection for purchase tracking.
- Company analytics endpoint (revenue, sold/remaining trend).
- Buyer market ranking endpoint (revenue/profit ranking + top profit company).
- Professional dashboard UI with charts and responsive sidebar layout.
