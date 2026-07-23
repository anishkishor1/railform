# AntiGravity Model Management System

![AntiGravity System Architecture](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200)

## Overview

**AntiGravity Model Management System** is a enterprise-grade full-stack web application designed for centralizing, managing, benchmarking, and tracking Artificial Intelligence and Machine Learning models. Built using modern clean architecture, SOLID principles, glassmorphic UI aesthetics, and secure REST APIs.

---

## Key Features

- **Authentication & Security**:
  - JWT Access Token & Refresh Token Rotation
  - Password hashing with bcrypt
  - Role-Based Access Control (RBAC: Admin, Manager, User)
  - Password reset flow, email verification, Rate limiting, Helmet security headers, CORS protection

- **AntiGravity Models Module**:
  - Dynamic pagination, filtering, searching, and sorting
  - Model creation with frameworks (PyTorch, TensorFlow, HuggingFace)
  - Accuracy scoring, parameter counts, and versioning
  - Multi-image uploads via Multer
  - Tagging and Category management

- **Analytics Dashboard**:
  - Glassmorphic statistics cards with charts
  - System performance, total models, user distribution, and download analytics

- **Modern Glassmorphic UI**:
  - React 19, TypeScript, Vite, Tailwind CSS, Framer Motion animations
  - Mobile responsive drawer sidebar & navbar
  - Dark mode design system

---

## Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Glassmorphic Utilities
- **State Management**: Redux Toolkit & React Query
- **Routing & Forms**: React Router v6, React Hook Form, Zod
- **Animations & Icons**: Framer Motion, Lucide React

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MySQL 8.0+
- **ORM**: Prisma ORM
- **Security & Utilities**: JWT, bcrypt, Express Validator, Helmet, Morgan, Multer

---

## Project Folder Structure

```
antigravity-system/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── prisma/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── app.ts
│   └── server.ts
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
└── docs/
    ├── API.md
    └── README.md
```

---

## Setup & Local Installation

### Prerequisites
- Node.js >= 18.x
- MySQL Server >= 8.0 running on localhost:3306

### 1. Database Initialization
Import `schema.sql` and `seed.sql` into MySQL:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma db pull
npx prisma generate
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The application will be accessible at: `http://localhost:5173`.
