# ELIETT - E-Commerce & Admin Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-Remote%20Pool-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Server%20Runtime-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-Unlicensed-lightgrey)](LICENSE)

ELIETT is a modular e-commerce and administration platform built with the Next.js App Router, designed to separate the storefront from the admin experience while keeping the stack lightweight, secure, and production-ready. The project focuses on a fast user experience, secure authentication, and a maintainable architecture that can scale across product, inventory, and operational workflows.

It solves a common problem in modern commerce systems: combining a public-facing shopping experience with an authenticated admin panel without creating a tangled codebase. ELIETT keeps those concerns isolated at the routing, layout, and middleware layers, which makes the application easier to evolve, debug, and deploy.

**Live Demo:** [https://eliett.com.mx](https://eliett.com.mx)

## Architecture & Key Technical Features

ELIETT uses route groups in the App Router to keep the storefront and the admin surface clearly separated. That structure gives each area its own layout, styles, and access rules without duplicating the whole app shell.

Authentication is intentionally lightweight: the admin login flow uses Argon2-WASM to verify the password hash and JWT to issue the session token. This approach keeps the authentication logic compatible with server environments while avoiding heavier auth dependencies for a single-admin workflow.

For data access, the backend uses a shared MySQL connection pool configured for a remote Hostinger database. Reusing the pool prevents connection churn, improves latency, and avoids exhausting remote database limits during local development or production traffic spikes.

The production image flow is optimized for payload reduction using WebP-oriented handling, helping keep page weight low and improving perceived performance on the storefront.

A custom proxy/middleware layer normalizes routes and protects the admin area from bypassed login access. It also keeps authenticated users away from the login page once a valid session is present.

## Project Structure

```text
.
├── app/
│   ├── (shop)/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── (admin)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── admin/dashboard/
│   │       └── page.tsx
│   ├── components/
│   │   ├── LoginForm/
│   │   ├── Navbar/
│   │   └── icons/
│   ├── fonts/
│   ├── fonts.ts
│   ├── globals.css
│   └── layout.tsx
├── backend/
│   ├── actions/
│   ├── db/
│   └── utils/
├── public/
├── proxy.ts
├── script.ts
└── types/
```

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Node.js
- Express-compatible backend patterns
- MySQL with `mysql2` connection pooling
- MongoDB-ready project boundaries for future growth
- TailwindCSS and CSS Modules
- Argon2-WASM for password hashing
- JWT with `jose` for session handling

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- Access to the remote MySQL instance or a local equivalent

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

If your repository includes an `.env.example`, copy it to `.env.local` and fill in the values.

If you do not have an `.env.example` yet, create `.env.local` with the following variables:

```bash
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=your-database-name
DB_PORT=3306

JWT_SECRET=your-long-jwt-secret

ADMIN_HASH=your-argon2-encoded-hash
ADMIN_HASH_B64=your-base64-encoded-argon2-hash
```

### 3. Generate the admin password hash

Use an external tool or a script to generate an Argon2 hash for the admin password and encode the hash in Base64 representation so you can paste them into `ADMIN_HASH` and `ADMIN_HASH_B64` to avoid server formatting issues.

### 4. Run the app locally

```bash
npm run dev
```

The application will start in development mode with the storefront and admin routes handled through the App Router.

### 5. Build for production

```bash
npm run build
npm start
```

## Environment Variables

The application currently relies on the following variables:

- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_PORT`
- `JWT_SECRET`
- `ADMIN_HASH`
- `ADMIN_HASH_B64`

## Notes

- The admin section is protected at the proxy layer, so direct navigation to `/admin` requires a valid session token.
- The login flow is optimized for a single-admin or small-operator workflow where security and simplicity matter more than a full identity provider integration.
- The repository does not currently include a license file. Add one if you plan to formalize distribution terms for external contributors.