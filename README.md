# AssetFlow — Enterprise Asset Management System

AssetFlow is a modern, enterprise-grade Asset Management System built to streamline IT and organizational hardware allocation, tracking, maintenance pipelines, and resource booking.

Developed as a high-performance Next.js application, it integrates a PostgreSQL database via Prisma ORM and incorporates visual metrics, interactive scheduling, and role-based authorization.

---

## 🚀 Key Features

*   **Executive Dashboard**: Modern workspace featuring real-time KPI metrics, active request timelines, and interactive charts (Bar and Pie charts) for asset status and distribution.
*   **Database Connectivity**: Prisma ORM configuration with PostgreSQL support. Programmatic seeding automatically populates schema tables from standard JSON datasets.
*   **Verification Utilities**: Built-in QR Code and Barcode generator modules for quick physical inventory audits and scanning.
*   **Interactive Role-Based Access Control (RBAC)**: Distinct permissions for System Admins, Asset Managers, Department Heads, and general Employees. Includes client-side page authorization guards and route protection.

---

## 🛠️ Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Database & ORM**: PostgreSQL & Prisma ORM
*   **Styling**: Material UI (MUI), Lucide Icons
*   **State Management & Data Fetching**: TanStack React Query v5
*   **Forms**: React Hook Form

---

## 📦 Project Structure & Branches

The repository is structured into two main tracks:

### 1. `main` Branch (Base)
Contains the stable UI interface, Prisma database connectivity, seeding scripts, and resolved repository conflicts.
*   *Authentication*: Simulated switcher.

### 2. `authentication` Branch (Feature)
Adds the fully functional **Role-Based Authentication and Access System** built using Next.js route handlers, base64 session cookies, client-side React contexts, and custom loaders.
*   *Branch Checkout*: `git checkout authentication`

---

## ⚙️ Installation & Setup

Follow these steps to configure and run AssetFlow locally:

### 1. Prerequisites
Ensure you have **Node.js** and **pnpm** installed on your system.

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/vkchavda13/hackathon.git
cd hackathon
pnpm install
```

### 3. Configure Database
Copy the placeholder environment file and edit your database URL:
```bash
# In your .env file:
DATABASE_URL="postgresql://username:password@localhost:5432/assetflow?schema=public"
```

### 4. Database Initialization & Seeding
Deploy the schema and seed mock data:
```bash
pnpm exec prisma db push
pnpm exec ts-node prisma/seed.ts
```

### 5. Start Development Server
```bash
pnpm dev -- -p 3001
```
Open **`http://localhost:3001`** in your browser.

---

## 🧪 Testing Role-Based Authentication (`authentication` branch)

To test user access restrictions:
1. Switch to the authentication branch: `git checkout authentication`.
2. Open `http://localhost:3001` (you will be redirected to `/login`).
3. Log in using any of the following pre-seeded credentials (any password, e.g. `password`, is accepted):

| Email | Designation | Assigned Role | Screen Access |
|---|---|---|---|
| `rajesh.sharma@assetflow.com` | IT Director | **System Admin** | Full access to all screens. |
| `sanjay.mishra@assetflow.com` | Operations Manager | **Asset Manager** | All screens except *Organization* structure. |
| `anita.desai@assetflow.com` | HR Director | **Dept Head** | Restricted to allocations, bookings, and reports. |
| `neha.kapoor@assetflow.com` | Senior Developer | **Staff Member** | Access to dashboard, asset listings, bookings, and alerts. |

*Note: You can switch roles on-the-fly using the simulated **Active Role** button at the bottom of the sidebar to test UI states instantly.*
