# Event Management — Vendor Portal Frontend

> Standalone Next.js 15 vendor-facing portal for the Event Management platform. Vendors authenticate with their own credentials and manage clients, events, staff, payments, communication, and analytics.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.1.0 (App Router) |
| Language | TypeScript |
| UI | shadcn/ui + Radix UI |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React + FontAwesome 7.2.0 |
| Data Fetching | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios (proxy: `/api/proxy/v1`) |
| Charts | Recharts 2.15.4 |
| Maps | Leaflet 1.9.4 + React Leaflet + Google Maps SDK |
| Date Picker | react-day-picker |
| Themes | next-themes |
| Toasts | Sonner |
| Auth | Cookie-based JWT (HTTP-only, vendor-specific) |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/                         # Public auth routes
│   │   ├── login/page.tsx              # Vendor login
│   │   ├── forgot-password/page.tsx    # Password recovery
│   │   ├── reset-password/page.tsx     # Password reset
│   │   └── layout.tsx                  # Auth shell layout
│   ├── (dashboard)/                    # Protected routes
│   │   ├── layout.tsx                  # Dashboard shell (Sidebar + Header + Breadcrumb)
│   │   ├── dashboard/page.tsx          # Stats, charts, recent tables
│   │   ├── profile/                    # View, edit, tabs (activity, security, notifications)
│   │   ├── activity-log/page.tsx       # Vendor action log with filters
│   │   ├── clients/                    # CRUD + view + events per client
│   │   ├── events/create/              # Create event form
│   │   ├── staff/                      # CRUD staff members
│   │   ├── payment-management/         # Payments + payment methods
│   │   ├── communication/
│   │   │   ├── chat/page.tsx           # Chat with clients
│   │   │   ├── contact/                # Contact management
│   │   │   └── email/page.tsx          # Email communication
│   │   ├── mail/                       # Inbox, compose
│   │   └── messages/page.tsx           # Direct messages / notifications
│   ├── api/
│   │   ├── proxy/v1/[...path]/route.ts # API proxy to backend
│   │   ├── vendors/auth/login/route.ts # Sets HttpOnly vendor cookies
│   │   └── logout/route.ts             # Clears HttpOnly vendor cookies
│   ├── layout.tsx                      # Root layout
│   └── page.tsx                        # Root → redirects to /dashboard or /login
├── components/
│   ├── ui/                             # shadcn/ui primitives
│   ├── layout/
│   │   ├── Sidebar/VendorSidebar.tsx   # Collapsible icon sidebar
│   │   ├── Header/VendorHeader.tsx     # Top navigation bar
│   │   ├── Breadcrumb/                 # Dynamic breadcrumbs
│   │   └── Content/                    # StatsCards, ChartsSection, TablesSection
│   └── common/                         # Shared components
├── hooks/
│   ├── use-vendors.ts                  # Vendor auth + profile hooks
│   ├── use-media.ts                    # File upload hook
│   └── use-mobile.ts                   # Responsive detection
├── lib/
│   ├── api-client.ts                   # Axios instance
│   ├── query-client.ts                 # React Query config
│   └── utils.ts                        # Helpers (cn, resolveMediaUrl)
├── providers/
│   └── query-provider.tsx              # QueryClientProvider
└── middleware.ts                       # Route protection (vendor cookies)
```

---

## All Pages & Modules

### Authentication (Public)
| Route | Description |
|---|---|
| `/login` | Vendor login with email + password |
| `/forgot-password` | Request password reset |
| `/reset-password` | Reset password with token |

### Dashboard (Protected — requires vendor session)
| Route | Description |
|---|---|
| `/dashboard` | Stats cards, line/bar charts, recent orders + clients tables |
| `/profile` | Vendor profile: company info, personal info, avatar |
| `/profile/edit` | Edit profile details |
| `/activity-log` | All vendor actions (login, logout, profile, password changes) |
| `/clients` | Client list with search/filter |
| `/clients/add` | Add new client (multi-step form) |
| `/clients/edit/[id]` | Edit client |
| `/clients/view/[id]` | Client detail view |
| `/clients/view/[id]/events` | Events for a specific client |
| `/events/create` | Create new event (comprehensive form with map) |
| `/staff` | Staff member list |
| `/staff/add` | Add staff |
| `/staff/edit/[id]` | Edit staff |
| `/staff/view/[id]` | View staff details |
| `/payment-management` | Transactions and payment history |
| `/payment-management/add` | Add payment method / bank account |
| `/communication/chat` | Real-time chat with clients |
| `/communication/contact` | Contact submissions |
| `/communication/contact/[id]/view` | View contact details |
| `/communication/email` | Email interface |
| `/mail` | Email inbox |
| `/mail/compose` | Compose email |
| `/messages` | Direct messages / notifications |

---

## API Integration

**Proxy pattern:**
```
Browser → /api/proxy/v1/* → Next.js Route Handler → http://localhost:5001/api/v1/*
```

**Special routes:**
- `POST /api/vendors/auth/login` — Calls backend + sets `vendor_access_token` + `vendor_refresh_token` as HttpOnly cookies
- `GET /api/logout` — Clears HttpOnly vendor cookies server-side, redirects to `/login`

**Response shape:**
```ts
ApiResponse<T> { success, message?, data?, errors? }
```

---

## Authentication

**Flow:**
1. Vendor submits credentials on `/login`
2. Calls `POST /api/vendors/auth/login` (NOT through proxy — direct Next.js handler)
3. Handler calls backend, then sets `vendor_access_token` + `vendor_refresh_token` as HttpOnly cookies
4. Frontend sets `vendor_auth_pending=true` JS cookie (15 sec)
5. Redirects to `/dashboard`
6. `middleware.ts` validates vendor cookies on all `/dashboard/*` routes
7. Logout: clears query cache + `vendor_auth_pending` + calls `/api/logout` to clear HttpOnly cookies

**Cookies:**
| Cookie | Type | TTL | Purpose |
|---|---|---|---|
| `vendor_access_token` | HTTP-only | 15 min | Vendor JWT |
| `vendor_refresh_token` | HTTP-only | 7 days | Token refresh |
| `vendor_auth_pending` | JS-writable | 15 sec | Middleware bridge |

**JWT payload:** `{ id, email, type: 'vendor' }` — `type` field distinguishes from admin tokens

---

## Vendor Profile Model

```ts
interface Vendor {
  id: number;
  company_name: string;
  company_logo: string | null;
  country_id, state_id, city_id, pincode_id: number | null;
  reg_no, gst_no: string | null;
  company_address, company_contact, landline, company_email: string | null;
  website: string | null;
  // Social links:
  youtube, facebook, instagram, twitter, linkedin, whatsapp, tiktok, telegram, pinterest: string | null;
  name: string;
  profile: string | null;         // Avatar URL
  address, contact: string | null;
  email: string;
  membership: 'basic' | 'silver' | 'gold' | 'platinum';
  // Bank details:
  bank_name, acc_no, ifsc_code: string | null;
  acc_type: 'savings' | 'current' | 'overdraft' | null;
  branch, bank_logo: string | null;
  status: 'active' | 'inactive';
  company_id: number | null;
}
```

---

## Custom Hooks

### `use-vendors.ts`
| Hook | Description |
|---|---|
| `useVendorMe()` | GET `/vendors/auth/me`, 5 min cache |
| `useVendorLogout()` | POST logout, clears cache + cookies, redirects |
| `useUpdateVendorProfile()` | PUT `/vendors/auth/profile`, invalidates cache |
| `useChangeVendorPassword()` | POST `/vendors/auth/change-password` |
| `useVendorActivityLog(params?)` | GET `/vendors/auth/activity` with pagination + module filter |

### `use-media.ts`
| Hook | Description |
|---|---|
| `useUploadMedia()` | POST `/media/upload` (multipart), returns `{ url, filename }` |

### `use-mobile.ts`
| Hook | Description |
|---|---|
| `useMobile()` | Returns `true` if screen width < 768px |

---

## Activity Log Module Filters

The activity log supports filtering by `module`:
- `vendor_auth` — login/logout events
- `vendor_security` — password changes
- `vendor_profile` — profile updates
- `vendor_system` — system-level actions

---

## Key Features

| Feature | Details |
|---|---|
| **Dashboard** | Stats cards, Recharts line/bar/area charts, recent data tables |
| **Client Management** | Full CRUD with multi-step forms, client-event associations |
| **Event Management** | Create events with date, location (map), price, capacity |
| **Staff Management** | Full CRUD for staff members |
| **Payment Management** | Transaction history, bank account management |
| **Communication** | Chat, email, contact submissions, direct messages |
| **Profile & Security** | Avatar upload, bank details, social links, password change |
| **Activity Logging** | Full audit trail with IP, user agent, module filtering |
| **Responsive Design** | Mobile-first, collapsible sidebar via `useMobile()` |
| **Dark Mode** | next-themes integration |

---

## React Query Config

```ts
staleTime: 5 min    // vendor-me cache
gcTime:    15 min
retry:     false
```

---

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
```

---

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3001
npm run build
npm run start
```
