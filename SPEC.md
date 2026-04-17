# CMS Wedding Studio — Project Specification

> **Version:** 1.0.0
> **Last updated:** 2026-04-02
> **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Prisma ORM · MariaDB · NextAuth.js

---

## 1. Concept & Vision

Hệ thống CMS nội bộ dành cho studio chụp ảnh cưới — giúp quản lý toàn bộ workflow từ tiếp nhận khách hàng, quản lý lịch hẹn, tạo album ảnh, đến xuất bản gallery công khai cho khách xem. Giao diện mang phong cách **sang trọng, tối giản** — phản ánh đẳng cấp của dịch vụ cưới cao cấp. Màu sắc ấm áp (champagne, gold, cream) kết hợp typography thanh lịch, không giao diện cms rẻ tiền.

---

## 2. Design Language

### 2.1 Aesthetic Direction

**Refined Luxury** — inspired by high-end wedding invitation design. Clean whitespace, subtle texture, warm neutrals. Every detail signals "premium service." The admin panel should feel like a design tool, not a legacy ERP.

### 2.2 Color Palette

```
Primary:        #1C1917  (Stone 900 — deep warm black, text dominant)
Secondary:      #78716C  (Stone 500 — muted warm gray, secondary text)
Accent:         #C9A84C  (Champagne Gold — highlight, CTAs, active states)
Accent Light:   #F5EFE0  (Cream — backgrounds, cards)
Background:     #FAFAF8  (Off-white — page background)
Surface:        #FFFFFF  (White — card surfaces)
Border:         #E7E5E4  (Stone 200 — subtle borders)
Error:          #DC2626  (Red 600)
Success:        #16A34A  (Green 600)
Warning:        #D97706  (Amber 600)
```

### 2.3 Typography

```
Font Family:    "Plus Jakarta Sans" (Google Fonts) — headings & body
Fallback:       system-ui, -apple-system, sans-serif

Scale:
  --text-xs:    0.75rem  / 12px
  --text-sm:    0.875rem / 14px
  --text-base:  1rem     / 16px
  --text-lg:    1.125rem / 18px
  --text-xl:    1.25rem  / 20px
  --text-2xl:   1.5rem   / 24px
  --text-3xl:   1.875rem / 30px
  --text-4xl:   2.25rem  / 36px

Weights:        400 (body) · 500 (medium) · 600 (semibold) · 700 (bold)
Line heights:   1.4 (headings) · 1.6 (body)
Letter spacing: -0.02em (headings), normal (body)
```

### 2.4 Spatial System

```
Base unit:      4px
Spacing scale:  4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96px
Border radius:  4px  (inputs) · 8px (cards) · 12px (modals) · 9999px (badges/pills)
```

### 2.5 Motion Philosophy

- **Entrance:** fade-in + translateY(8px) → translateY(0), 200ms ease-out
- **Stagger:** 50ms delay between list items on load
- **Hover:** scale(1.02) on cards, color transitions 150ms ease
- **Page transitions:** fade 150ms
- **Micro-interactions:** button press scale(0.98), toggle slide 200ms
- **No animation:** modals/dropdowns should appear instantly (0ms) — luxury ≠ slow

### 2.6 Visual Assets

- **Icons:** Lucide React — consistent 1.5px stroke, 20px default size
- **Images:** Unsplash for placeholder/demo imagery
- **Decorative:** Subtle grain texture overlay on hero areas, thin gold accent lines as dividers
- **Empty states:** Minimal line illustrations, not cartoon graphics

---

## 3. Layout & Structure

### 3.1 Application Shell

```
┌──────────────────────────────────────────────────────┐
│  Sidebar (240px fixed)  │  Main Content Area         │
│  ─────────────────────  │  ─────────────────────────  │
│  Logo / Brand           │  Top Bar (breadcrumb +      │
│  ─────────────────────  │    user menu + notifications)│
│  Navigation Menu       │  ─────────────────────────  │
│    Dashboard            │                             │
│    Albums               │  Page Content               │
│    Photos               │  (scrollable)               │
│    Customers            │                             │
│    Bookings             │                             │
│    Services             │                             │
│    Gallery (public)     │                             │
│    Reports              │                             │
│    Settings             │                             │
│  ─────────────────────  │                             │
│  User Profile          │                             │
│  Logout                 │                             │
└──────────────────────────────────────────────────────┘
```

### 3.2 Sidebar

- Width: 240px, fixed left, full height
- Background: `#1C1917` (dark) — contrast with light main area
- Logo area: 60px height, centered studio name in gold
- Menu items: icon (20px) + label, active state with gold left border + gold text
- Bottom: user avatar (32px circle) + name + logout icon
- Collapsible to 64px icon-only mode on mobile/tablet

### 3.3 Top Bar

- Height: 60px
- Left: Breadcrumb navigation (text)
- Right: Search (Cmd+K) · Notifications bell · User dropdown
- Background: white with bottom border

### 3.4 Responsive Strategy

```
Desktop (≥1280px):  Sidebar fixed 240px + content fills remaining
Tablet  (768-1279): Sidebar collapses to icon-only (64px)
Mobile  (<768px):   Sidebar hidden, hamburger menu, full-width content
```

### 3.5 Page Layout Patterns

- **List pages:** Filter bar (sticky) → Data table → Pagination
- **Detail pages:** Header with title + actions → Two-column (main 2/3 + sidebar 1/3)
- **Form pages:** Centered card (max-width 640px) or two-column form on wide screens
- **Gallery pages:** Masonry grid (3-4 columns), lightbox on click

---

## 4. Features & Interactions

### 4.1 Authentication

| Feature | Behavior |
|---|---|
| Login | Email + password, single admin account initially. Show/hide password toggle. "Remember me" checkbox. Error shows inline below input, shake animation. |
| Session | JWT via NextAuth.js. Session expires after 30 days. Protected routes redirect to `/login`. |
| Logout | Confirmation not required. Clear session, redirect to `/login`. |

### 4.2 Dashboard

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Bookings    │  │ Albums      │  │ Customers   │  │ Revenue     │
│ this month  │  │ total       │  │ new (30d)   │  │ this month  │
│   12        │  │   148       │  │   8         │  │ 45,200,000đ │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘

Recent Bookings Table:
┌──────────────────┬────────────┬─────────────┬──────────────┬─────────────┐
│ Customer         │ Service    │ Date         │ Status       │ Actions     │
│ Nguyễn Văn A     │ Gói Cưới  │ 2026-04-15   │ Confirmed    │ View · Edit │
│ Trần Thị B       │ Gói Ngoại  │ 2026-04-18   │ Pending      │ View · Edit │
└──────────────────┴────────────┴─────────────┴──────────────┴─────────────┘

Recent Albums:
[Album Card] [Album Card] [Album Card] — horizontal scroll
```

### 4.3 Albums Module

| Action | Behavior |
|---|---|
| List | Grid of album cards (cover image, title, customer name, photo count, date, status badge). Filter by status. Sort by date/title. |
| Create | Modal or dedicated page. Fields: Title, Customer (searchable dropdown), Description, Cover image upload, Date, Status (draft/public). Save creates empty album. |
| Edit | Same form as create. Shows photo count. |
| Delete | Confirmation dialog: "Xóa album này sẽ xóa toàn bộ ảnh bên trong. Tiếp tục?" → Confirm / Cancel. |
| Upload Photos | Drag-drop zone or click to select. Multi-file support. Progress bar per file. Auto-generate thumbnail. Show upload count. |
| Reorder | Drag-and-drop grid to reorder photos within album. Order auto-saved. |
| Gallery link | Generate shareable public link. Copy button. Option to set password protection. |

### 4.4 Photos Module

| Action | Behavior |
|---|---|
| Browse | Masonry grid of all photos across albums. Infinite scroll. Click opens lightbox. |
| Upload | Drag-drop zone accepts JPG/PNG/WEBP, max 20MB each. Validation inline. |
| Edit metadata | Caption, tags (comma-separated), date taken. Batch edit selected photos. |
| Delete | Multi-select photos → bulk delete with confirmation. |
| Download | Download single or selected photos as ZIP. |

### 4.5 Customers Module

| Action | Behavior |
|---|---|
| List | Table: Name, Phone, Email, Booking count, Created date. Search by name/phone. |
| Create/Edit | Form: Name*, Phone*, Email, Address, Note. All fields optional except name. |
| View | Customer detail page: profile info + list of bookings + list of albums. |
| Delete | Soft delete (archive) — customer data preserved for history. |

### 4.6 Bookings Module

| Action | Behavior |
|---|---|
| List | Table: Customer, Service, Date, Status, Total price. Filters: date range, status, service. |
| Create | Form: Customer (existing or new), Service (dropdown), Date & time, Note. Auto-calculate total from service price. |
| Status flow | `Pending → Confirmed → In Progress → Completed` or `Cancelled`. Each transition is a button click. Status badge color-coded. |
| Edit | Update any field. Recalculate total if service changed. |
| Delete | Soft delete. |

**Status colors:**
- `Pending`: Amber badge
- `Confirmed`: Blue badge
- `In Progress`: Purple badge
- `Completed`: Green badge
- `Cancelled`: Gray badge

### 4.7 Services Module

| Action | Behavior |
|---|---|
| List | Card grid: service name, description excerpt, price, duration, photo count. |
| Create/Edit | Form: Name*, Description, Price*, Duration (days), Included items (textarea), Cover image. |
| Delete | Only if no bookings use this service. Otherwise show warning. |

### 4.8 Public Gallery

- **URL:** `/gallery/[albumSlug]`
- **Access:** Public (no login required if no password) or password-protected
- **Layout:** Full-screen masonry grid, lightbox on click with arrows navigation
- **Header:** Album title + photographer credit from settings
- **Watermark:** Optional (configurable in settings — overlay studio logo/text)
- **Download:** Disabled by default (configurable)

### 4.9 Reports Module

- Revenue by month (bar chart)
- Bookings by status (pie chart)
- Top services by revenue
- Customer growth over time
- Date range picker filter

### 4.10 Settings Module

- **General:** Studio name, logo, contact info, footer text
- **Gallery:** Watermark toggle + position, download toggle
- **User:** Change password

---

## 5. Component Inventory

### 5.1 Base UI Components

| Component | States | Notes |
|---|---|---|
| `Button` | default, hover, active, disabled, loading | Variants: primary (gold), secondary (outlined), ghost, danger. Sizes: sm, md, lg. |
| `Input` | default, focus, error, disabled | With optional label, helper text, error message. |
| `Select` | default, open, error, disabled | Searchable for long lists (customers, albums). |
| `Textarea` | same as Input | Auto-resize up to max-height. |
| `Checkbox` | unchecked, checked, indeterminate, disabled | Custom styled, gold accent. |
| `Badge` | — | Variants: success, warning, error, info, neutral. Pill shape. |
| `Card` | default, hover (optional) | Shadow-sm, rounded-lg. Optional header/footer slots. |
| `Modal` | — | Centered, backdrop blur, close on ESC/outside click. Sizes: sm/md/lg/full. |
| `Dropdown` | closed, open | Click to toggle, close on outside click. Used for user menu, actions menu. |
| `Table` | — | Sortable columns (click header), hover row highlight, loading skeleton. |
| `Pagination` | — | Page numbers + prev/next. Show total count. |
| `Avatar` | — | Circle, initials fallback if no image. Sizes: sm/md/lg. |
| `Skeleton` | — | Pulse animation, matches shape of real content. |
| `Toast` | success, error, warning, info | Auto-dismiss 4s. Stack in bottom-right. |
| `Lightbox` | — | Full-screen overlay, prev/next arrows, close button, image counter. |
| `EmptyState` | — | Icon + heading + description + optional CTA button. |
| `FileUpload` | idle, dragging, uploading, success, error | Progress bar, file preview thumbnails. |

### 5.2 Dashboard-Specific Components

| Component | Description |
|---|---|
| `StatCard` | Icon + label + value + optional trend indicator (up/down arrow + percentage) |
| `RecentBookingsTable` | Compact table, max 5 rows, "View all" link |
| `RecentAlbumsGrid` | Horizontal scroll, 3 visible album cards |
| `Chart` | Recharts-based: Bar, Pie, Line — matching color palette |

### 5.3 Layout Components

| Component | Description |
|---|---|
| `Sidebar` | Dark theme, fixed, collapsible |
| `TopBar` | Sticky, search + user menu |
| `PageHeader` | Title + description + action buttons slot |
| `Breadcrumb` | Auto-generated from route |
| `ProtectedRoute` | HOC/wrapper that checks auth |

---

## 6. Technical Approach

### 6.1 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx          ← Auth layout (no sidebar)
│   ├── (dashboard)/
│   │   ├── layout.tsx          ← Dashboard shell (sidebar + topbar)
│   │   ├── page.tsx            ← /
│   │   ├── albums/
│   │   │   ├── page.tsx         ← List
│   │   │   ├── new/page.tsx     ← Create
│   │   │   └── [id]/
│   │   │       ├── page.tsx     ← Detail
│   │   │       └── edit/page.tsx ← Edit
│   │   ├── photos/page.tsx
│   │   ├── customers/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── edit/page.tsx
│   │   ├── bookings/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── services/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       └── edit/page.tsx
│   │   ├── reports/page.tsx
│   │   └── settings/page.tsx
│   ├── gallery/
│   │   └── [slug]/
│   │       └── page.tsx         ← Public gallery (no auth)
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── albums/
│   │   │   └── route.ts
│   │   ├── upload/
│   │   │   └── route.ts
│   │   └── ...
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                     ← Base components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── table.tsx
│   │   ├── pagination.tsx
│   │   ├── toast.tsx
│   │   ├── avatar.tsx
│   │   ├── skeleton.tsx
│   │   ├── empty-state.tsx
│   │   ├── file-upload.tsx
│   │   └── lightbox.tsx
│   ├── dashboard/
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   ├── stat-card.tsx
│   │   └── page-header.tsx
│   └── gallery/
│       ├── masonry-grid.tsx
│       └── photo-lightbox.tsx
├── lib/
│   ├── prisma.ts               ← Prisma client singleton
│   ├── auth.ts                 ← NextAuth config
│   ├── utils.ts                ← cn(), formatCurrency(), formatDate()
│   └── upload.ts               ← File upload handler
├── actions/                    ← Server Actions
│   ├── albums.ts
│   ├── photos.ts
│   ├── customers.ts
│   ├── bookings.ts
│   └── services.ts
├── types/
│   └── index.ts                ← Shared types
└── hooks/
    ├── use-toast.ts
    └── use-confirm.ts
```

### 6.2 Database Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ─── Auth ───────────────────────────────────────────────────────────────────

model User {
  id           Int       @id @default(autoincrement())
  email        String    @unique
  passwordHash String
  name         String?
  role         Role      @default(STAFF)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

enum Role {
  ADMIN
  STAFF
}

// ─── Business ───────────────────────────────────────────────────────────────

model Customer {
  id        Int       @id @default(autoincrement())
  name      String
  phone     String?
  email     String?
  address   String?   @db.Text
  note      String?   @db.Text
  isArchive Boolean   @default(false)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  bookings  Booking[]
  albums    Album[]
}

model Service {
  id           Int       @id @default(autoincrement())
  name         String
  description  String?   @db.Text
  price        Decimal   @db.Decimal(12, 0)
  durationDays Int       @default(1)
  includedItems String?  @db.Text      // newline-separated
  coverImage   String?
  isActive     Boolean   @default(true)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  bookings     Booking[]
}

model Booking {
  id         Int            @id @default(autoincrement())
  customerId Int
  serviceId  Int
  bookingDate DateTime
  status     BookingStatus  @default(PENDING)
  totalPrice Decimal        @db.Decimal(12, 0)
  note       String?        @db.Text
  isArchive  Boolean        @default(false)
  createdAt  DateTime       @default(now())
  updatedAt  DateTime       @updatedAt
  customer   Customer       @relation(fields: [customerId], references: [id])
  service    Service        @relation(fields: [serviceId], references: [id])
}

enum BookingStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model Album {
  id           Int       @id @default(autoincrement())
  customerId   Int?
  title        String
  slug         String    @unique
  description  String?   @db.Text
  coverImage   String?
  galleryPassword String?  // optional password protection
  isPublic     Boolean   @default(false)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  customer     Customer? @relation(fields: [customerId], references: [id])
  photos       Photo[]
}

model Photo {
  id            Int      @id @default(autoincrement())
  albumId       Int
  url           String
  thumbnailUrl  String?
  originalName  String?
  fileSize      Int?     // bytes
  width         Int?
  height        Int?
  caption       String?
  sortOrder     Int      @default(0)
  createdAt     DateTime @default(now())
  album         Album    @relation(fields: [albumId], references: [id], onDelete: Cascade)
}

model Setting {
  id        Int     @id @default(autoincrement())
  key       String  @unique
  value     String  @db.Text
}
```

### 6.3 API Design

All data mutations use **Next.js Server Actions** (preferred). REST API routes only for external integrations.

**Server Actions pattern:**
```typescript
// src/actions/albums.ts
'use server'
export async function createAlbum(formData: FormData) { ... }
export async function updateAlbum(id: number, data: UpdateAlbumDTO) { ... }
export async function deleteAlbum(id: number) { ... }
export async function uploadPhotos(albumId: number, files: File[]) { ... }
```

**API Routes (REST fallback):**
```
POST   /api/auth/[...nextauth]   — NextAuth handlers
GET    /api/albums               — List albums (paginated)
POST   /api/albums               — Create album
GET    /api/albums/[id]         — Get album detail
PUT    /api/albums/[id]         — Update album
DELETE /api/albums/[id]         — Delete album
POST   /api/upload               — Upload file → return URL
GET    /api/gallery/[slug]       — Public gallery data
POST   /api/gallery/[slug]/auth — Verify gallery password
```

### 6.4 Authentication

- **Library:** NextAuth.js v5 with Credentials provider
- **Session strategy:** JWT (stateless, stored in HTTP-only cookie)
- **Password hashing:** bcryptjs (12 rounds)
- **Protected routes:** Middleware via `middleware.ts` pattern

### 6.5 File Upload

- **Storage:** Local filesystem (`/public/uploads/`) initially
- **Future:** Swappable to Cloudinary or S3-compatible storage
- **Image processing:** Sharp (resize, generate thumbnail, strip EXIF)
- **Constraints:** Max 20MB/file, accepted: JPG/PNG/WEBP

### 6.6 Key Libraries

```
Dependencies:
  next            ^15
  react           ^19
  typescript      ^5
  @prisma/client  ^6
  prisma          ^6 (dev)
  next-auth        ^5 (beta)
  bcryptjs         ^2
  sharp           ^0.33
  recharts        ^2
  lucide-react    ^0.468
  clsx            ^2
  tailwind-merge   ^2
  @tailwindcss/typography
  date-fns        ^4

Dev:
  tailwindcss     ^4
  @tailwindcss/postcss
  eslint          ^9
```

### 6.7 Environment Variables

```env
# Database
DATABASE_URL="mysql://cms_wedding:txju82krwdfwp5r62mi6@103.97.126.78:3306/cms_wedding"

# Auth
NEXTAUTH_SECRET="[generate with: openssl rand -base64 32]"
NEXTAUTH_URL="http://localhost:3000"

# Upload
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE_MB="20"
```

---

## 7. Milestones

| # | Milestone | Deliverables |
|---|---|---|
| 1 | **Scaffold & DB** | Next.js project init, Prisma schema, DB migration, env setup |
| 2 | **Auth** | Login page, NextAuth config, protected routes, middleware |
| 3 | **Dashboard Shell** | Sidebar, topbar, layout, base UI components (Button, Input, Card, Badge, Modal, Table, Toast) |
| 4 | **Customers + Services** | Full CRUD for both modules |
| 5 | **Bookings** | Full CRUD + status flow |
| 6 | **Albums + Photos** | Full CRUD + drag-drop reorder + file upload + thumbnail generation |
| 7 | **Public Gallery** | Public page with password protection + lightbox |
| 8 | **Reports** | Charts and date range filtering |
| 9 | **Settings** | General + gallery settings |
| 10 | **Polish** | Empty states, loading skeletons, error boundaries, responsive refinements |

---

## 8. Non-Goals (Out of Scope for v1)

- Multi-tenant / multi-studio support
- Mobile native apps
- Payment gateway integration
- Automated email/SMS notifications
- Role-based permissions beyond ADMIN/STAFF
- Photo editing (crop, filter, adjust)
- AI-powered tagging/face detection
