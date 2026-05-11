# Project Analysis

This document provides a summary of the project architecture and the technologies used across the main directories. 

## 1. Backend: `AdminPanel-Backend`
- **Location:** `D:\Jamal\AdminPanel-Backend`
- **Stack:** Node.js, Express.js
- **Database:** Sequelize ORM (MySQL/PostgreSQL) with `mysql2` driver.
- **Key Features:**
  - **Authentication:** Features JSON Web Tokens (`jsonwebtoken`) and password hashing (`bcryptjs`).
  - **Email Service:** Integration with `nodemailer`, `mailgun.js`, `imapflow`, and `mailparser` for extensive email operations.
  - **File Uploads:** Upload logic is handled through `multer` and AWS S3 (`@aws-sdk/client-s3`).
  - **Security & Logging:** Helmet for security headers, rate limiting (`express-rate-limit`), and Winston for daily log rotation.
  - **Tasks:** Contains `node-cron` for executing scheduled tasks.

## 2. Frontend 1: `vendor_portal`
- **Location:** `D:\Jamal\vendor_portal`
- **Stack:** Next.js 15 (App/Pages Router), React 19.
- **UI Framework:** Tailwind CSS and Shadcn UI (Radix-UI components like collapsible, lucide-react, react-hook-form, zod).
- **Key Features:**
  - Designed for the vendor portal experience.
  - Interactive components: Utilizes `@tanstack/react-query` for API state management.
  - Charts & Icons: `recharts` for internal data visualization, along with `FontAwesome`.
  - Notifications: Uses `sonner` for toast notifications.

## 3. Frontend 2: `dashboard_clone_07-03-2026_v1`
- **Location:** `D:\Jamal\dashboard_clone_07-03-2026_v1`
- **Stack:** Next.js 16 (canary/beta features), React 19.
- **Key Features:**
  - Complex Dashboard logic: Likely serves as an admin dashboard or clone of a specific platform.
  - Includes `@dnd-kit/core` for drag-and-drop mechanics.
  - Uses `react-day-picker` and `date-fns` for calendar utilities.
  - Charts: `react-apexcharts` and `recharts`.
  - Edge features: Includes `cheerio` for light parsing and `jose` for Edge-friendly JWT mechanics.

## Summary of Initial Build Issues on Vendor Portal:
- Specifically, the Vendor Portal (`vendor_portal`) faced a standard Next 15 / Linting build failure involving:
  - Missing `react-day-picker` module dependencies used by `shadcn/ui` calendar components.
  - ESLint flat configuration errors, where `eslint-config-next` wasn't formatted using `FlatCompat` correctly. 
  - Both of these errors were identified and patched to allow for `npm run build` to compile successfully.
