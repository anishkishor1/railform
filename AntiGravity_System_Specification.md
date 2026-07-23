# AntiGravity Model Management System - Full System Specification & Documentation

> **Role**: Senior Full Stack Software Architect, UI/UX Designer, Database Engineer, & DevOps Engineer  
> **Status**: Production Ready Architectural Blueprint & Implementation Guide  
> **Target Stack**: React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion + Node.js + Express.js + Prisma ORM + MySQL 8.0

---

## 1. Executive Summary

The **AntiGravity Model Management System** is an enterprise-grade artificial intelligence asset governance platform. It allows organizations to manage machine learning models, benchmark accuracy metrics, track framework dependencies (PyTorch, TensorFlow, HuggingFace, ONNX), organize model versions, control user access (RBAC), monitor API logs, and analyze system usage via real-time glassmorphic dashboards.

---

## 2. Directory Tree Structure

```
antigravity-system/
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   │   └── logo.svg
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── Skeleton.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   └── ConfirmDialog.tsx
│   │   │   └── navigation/
│   │   │       ├── Navbar.tsx
│   │   │       └── Sidebar.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useModels.ts
│   │   │   └── useToast.ts
│   │   ├── layouts/
│   │   │   ├── MainLayout.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   └── AdminLayout.tsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Register.tsx
│   │   │   │   ├── ForgotPassword.tsx
│   │   │   │   └── ResetPassword.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   └── UserDashboard.tsx
│   │   │   ├── models/
│   │   │   │   ├── ModelsList.tsx
│   │   │   │   ├── ModelDetail.tsx
│   │   │   │   └── ModelForm.tsx
│   │   │   ├── users/
│   │   │   │   └── UsersList.tsx
│   │   │   └── Settings.tsx
│   │   ├── routes/
│   │   │   ├── AppRoutes.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── modelService.ts
│   │   │   └── userService.ts
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── types/
│   │   │   ├── auth.ts
│   │   │   ├── model.ts
│   │   │   └── user.ts
│   │   ├── utils/
│   │   │   └── formatters.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── postcss.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── config/
│   │   ├── env.ts
│   │   ├── database.ts
│   │   └── jwt.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── modelController.ts
│   │   ├── userController.ts
│   │   ├── categoryController.ts
│   │   └── analyticsController.ts
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   ├── roleMiddleware.ts
│   │   ├── uploadMiddleware.ts
│   │   ├── validationMiddleware.ts
│   │   ├── rateLimiter.ts
│   │   └── errorHandler.ts
│   ├── models/
│   │   └── prismaClient.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── modelRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── categoryRoutes.ts
│   │   ├── analyticsRoutes.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── modelService.ts
│   │   ├── userService.ts
│   │   └── fileService.ts
│   ├── utils/
│   │   ├── apiResponse.ts
│   │   ├── hashUtils.ts
│   │   ├── jwtUtils.ts
│   │   └── logger.ts
│   ├── validators/
│   │   ├── authValidator.ts
│   │   ├── modelValidator.ts
│   │   └── userValidator.ts
│   ├── uploads/
│   │   └── .gitkeep
│   ├── app.ts
│   ├── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
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

## 3. Database Schema Specification (MySQL)

### DDL Schema Summary
- **roles**: `id` (PK, INT), `name` (VARCHAR), `description` (VARCHAR)
- **permissions**: `id` (PK, INT), `name` (VARCHAR), `description` (VARCHAR)
- **role_permissions**: (`role_id`, `permission_id`) Composite PK, FKs with CASCADE
- **users**: `id` (PK, UUID), `email` (UNIQUE), `password_hash`, `first_name`, `last_name`, `avatar`, `role_id` (FK), `is_verified`, `verification_token`, `reset_password_token`, `reset_password_expires`, `status`
- **categories**: `id` (PK, INT), `name` (UNIQUE), `slug` (UNIQUE), `description`, `icon`
- **models**: `id` (PK, UUID), `title`, `slug` (UNIQUE), `description`, `version`, `framework`, `parameters_count`, `accuracy_score`, `status` (DRAFT, ACTIVE, ARCHIVED, DEPRECATED), `category_id` (FK), `created_by_id` (FK), `downloads_count`, `views_count`
- **tags**: `id` (PK, INT), `name` (UNIQUE), `slug` (UNIQUE)
- **model_tags**: (`model_id`, `tag_id`) Composite PK, FKs with CASCADE
- **model_images**: `id` (PK, INT), `model_id` (FK), `url`, `is_primary`
- **logs**: `id` (PK, INT), `user_id`, `action`, `entity`, `entity_id`, `details` (JSON), `ip_address`, `created_at`
- **settings**: `id` (PK, INT), `key` (UNIQUE), `value`, `description`
- **sessions**: `id` (PK, UUID), `user_id` (FK), `refresh_token`, `device_info`, `expires_at`

---

## 4. Complete REST API Specifications

### Base Path: `/api/v1`

#### 4.1 Auth Endpoints (`/auth`)
- **POST `/auth/register`**: `{ email, password, firstName, lastName }` -> `{ user, tokens }`
- **POST `/auth/login`**: `{ email, password }` -> `{ user, tokens }`
- **POST `/auth/refresh-token`**: `{ refreshToken }` -> `{ accessToken }`
- **POST `/auth/logout`**: Header `Bearer <token>` -> Clears session
- **POST `/auth/forgot-password`**: `{ email }` -> Token email link
- **POST `/auth/reset-password`**: `{ token, newPassword }` -> Password updated
- **GET `/auth/me`**: Header `Bearer <token>` -> Authenticated user details

#### 4.2 Model Management Endpoints (`/models`)
- **GET `/models`**: Query params `page`, `limit`, `search`, `category`, `status`, `sortBy`, `sortOrder`
- **GET `/models/:id`**: Returns model with category, creator, tags, and images
- **POST `/models`**: Authorization `Bearer <token>` (Admin/Manager) -> Creates model
- **PUT `/models/:id`**: Authorization `Bearer <token>` (Admin/Manager) -> Updates model
- **DELETE `/models/:id`**: Authorization `Bearer <token>` (Admin) -> Archives/Deletes model
- **POST `/models/:id/images`**: Form-Data file upload -> Image asset link

#### 4.3 Users & Admin Endpoints (`/users`, `/analytics`)
- **GET `/users`**: List all users with pagination and role filters (Admin)
- **PUT `/users/:id`**: Change user status / assign roles (Admin)
- **GET `/analytics/overview`**: Summary counts (Total Models, Active Users, Categories, Downloads, Recent Logs)

---

## 5. Security & Architectural Standards

1. **Helmet & Security Headers**: Protection against XSS, clickjacking, MIME sniffing.
2. **Rate Limiting**: Express Rate Limit max 100 requests per 15 minutes window for public endpoints; max 5 requests per 15 minutes for auth endpoints.
3. **Authentication**: RSA/HS256 signed JWT tokens with 15-minute expiration + refresh token database rotation.
4. **Input Validation**: Express Validator & Zod schemas enforcing strict validation prior to database execution.
5. **Clean Architecture**: Controller -> Service -> Model/Prisma layer separation. Zero SQL injection risk via Prisma parameterization.

---

## 6. Setup & Execution Commands

### Backend Installation:
```bash
cd backend
npm install express prisma @prisma/client bcrypt jsonwebtoken dotenv cors helmet morgan express-validator multer winston express-rate-limit
npm install -D typescript @types/node @types/express @types/cors @types/morgan @types/jsonwebtoken @types/bcrypt @types/multer nodemon ts-node
npx prisma generate
npm run dev
```

### Frontend Installation:
```bash
cd frontend
npm install react react-dom react-router-dom @reduxjs/toolkit react-redux @tanstack/react-query axios react-hook-form zod @hookform/resolvers framer-motion lucide-react clsx tailwindmerge
npm install -D typescript @types/react @types/react-dom vite @vitejs/plugin-react tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

---

## 7. Associated Files & Links

- Database Schema DDL: [database/schema.sql](file:///c:/Users/haris/OneDrive/PPT_KISHORE/kishoreform/database/schema.sql)
- Database Seed Script: [database/seed.sql](file:///c:/Users/haris/OneDrive/PPT_KISHORE/kishoreform/database/seed.sql)
- API Specification: [docs/API.md](file:///c:/Users/haris/OneDrive/PPT_KISHORE/kishoreform/docs/API.md)
- Project README: [docs/README.md](file:///c:/Users/haris/OneDrive/PPT_KISHORE/kishoreform/docs/README.md)
