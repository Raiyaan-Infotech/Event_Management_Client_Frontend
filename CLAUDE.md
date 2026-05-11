# Event Management — Vendor Frontend

## Stack
- Next.js 15.1 (App Router) + React 19 + TypeScript 5
- UI: Shadcn/ui + Tailwind CSS + Lucide icons
- Data: TanStack Query v5 + Axios
- Deployed on **Vercel** — auto-deploys on push to `main`
- Live URL: https://event-management-vendor-frontend.vercel.app

## Environment Variables
```
NEXT_PUBLIC_API_URL=https://event-management-admin-backend.onrender.com/api/v1
NEXT_PUBLIC_APP_NAME=Vendor Portal
NEXT_PUBLIC_APP_URL=https://event-management-vendor-frontend.vercel.app
```

## Structure
```
src/app/
  (auth)/login/                  — vendor login
  (dashboard)/
    clients/                     — client CRUD
    staff/                       — staff CRUD + role assignment
    roles/                       — role + permission management
    modules/                     — view-only module list
    events/, communication/, settings/, ...
  api/
    proxy/v1/[...path]/route.ts  — forwards all requests to backend (forwards cookies)
    vendors/auth/login/route.ts  — sets HttpOnly cookies reliably
    logout/route.ts              — clears cookies
src/hooks/                       — TanStack Query hooks (use-vendor-roles.ts, use-vendors.ts, etc.)
src/middleware.ts                — protects /dashboard/* routes
```

## Auth
- Cookies: `vendor_access_token` (15min), `vendor_refresh_token` (7d), `vendor_auth_pending` (15s)
- JWT payload: `{ id, email, type: 'vendor' }` — type field, NOT role
- Vendor = SuperAdmin — bypasses all permission checks on backend
- All API calls go through proxy at `/api/proxy/v1/`

## RBAC System
- Vendor creates roles with permissions → assigns roles to staff
- Roles are vendor-scoped (`vendor_id = X`)
- Modules & Permissions are global (`vendor_id = NULL`)
- Role assignment to staff: vendor portal only via `PUT /vendors/staff/:id/role`
- Staff portal CANNOT assign roles

## Staff Form — Critical Convention
- Designation dropdown label = **"Designation"** — NEVER rename to "Role"
- `role_id` maps to a role but the label stays "Designation" (user preference)

## Key API Routes
```
GET/POST/PUT/DELETE /vendors/roles             — role management
PUT                 /vendors/roles/:id/permissions — assign permissions
GET                 /vendors/modules            — view-only
GET                 /vendors/permissions        — view-only
GET/POST/PUT/DELETE /vendors/clients           — client management
GET/POST/PUT/DELETE /vendors/staff             — staff management
PUT                 /vendors/staff/:id/role    — role reassignment (vendor-only)
PATCH               /vendors/staff/:id/status  — staff status toggle
```

## Client Module Fields
- `login_access` (TINYINT) — allow client portal login
- `send_credentials_to_email` (TINYINT) — email credentials on create
- Both shown as toggle switches in the client list

## Dev
```bash
npm run dev    # port 3001
npm run build
```

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
