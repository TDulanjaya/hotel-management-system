# LuxeStay - Enterprise Hotel Management System (PMS)

A full-stack Hotel Management / Property Management System built with Next.js 16, Spring Boot, and MongoDB. It manages end-to-end resort operations - reservations, front desk folios, checkout, dining & kitchen, housekeeping, laundry, inventory, banquet venues, game lounge, parking, and reporting.

---

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, SWR, Lucide Icons
- **Real-time**: STOMP over WebSockets (`@stomp/stompjs`, `sockjs-client`)
- **Backend**: Spring Boot 4, Java 17, Spring Security (JWT), Spring WebSocket, Spring Mail
- **Database**: MongoDB (Spring Data MongoDB)

---

## Architecture

```
Next.js frontend (pages, components, SWR cache, STOMP client)
        │
        ▼
BFF adapter layer — client/src/lib/api/*
(JWT header injection, response normalization, route guards)
        │
        ▼
Spring Boot REST + WebSocket API
(23 controllers, JWT security filter, STOMP broker at /ws)
        │
        ▼
MongoDB
```

### REST API

**What it is (simple terms):** REST is just a set of rules for how the frontend and backend talk to each other over HTTP. Each "thing" in the system (a room, a guest, an order) is a **resource**, and you use standard verbs to work with it: `GET` = read, `POST` = create, `PUT` = update, `DELETE` = remove. The server doesn't remember anything between requests — every request carries all the info it needs (this is what "stateless" means).

**In this project:** 23 controllers, one per module (rooms, guests, orders, etc.), each exposing `GET/POST/PUT/DELETE` for that resource. Requests are validated before they're processed, and the server always replies with a standard status code so the frontend knows what happened — `200` OK, `201` Created, `400` bad input, `401` not logged in, `403` no permission, `404` not found.

### BFF (Backend-for-Frontend) layer

**What it is (simple terms):** A BFF is a middle layer that sits between your UI and the real backend. Instead of every button/page calling the backend directly and each one repeating the same login-token logic and error handling, all requests pass through one shared layer first. That layer does the repetitive work once, and the UI just asks for data in a clean, simple way.

**In this project:** the Next.js client has its own API layer in `client/src/lib/api/*` that every request goes through — components never call the backend directly.

- **`authApi.ts`** - the core piece. `authenticatedFetch()` attaches the JWT token to every request and handles `401` globally (clears the token, redirects to `/login`). Instead of every screen checking "am I logged in?", this one function does it for everyone.
- **Data normalization** - Spring Data returns paginated results as `{ content: [...], totalElements, ... }`. The adapters unwrap this automatically so components just get plain arrays, instead of every component having to know about that wrapper shape.
- **One adapter per domain** - `roomApi.ts`, `reservationApi.ts`, `kitchenApi.ts`, `folioApi.ts`, `eventApi.ts`, `laundryApi.ts`, `gameApi.ts`, `inventoryApi.ts`, `pricingApi.ts`, `reportApi.ts`, etc. - so a backend change only touches one file, not every page that uses it.
- **SWR on top** - adapters plug into SWR (`swrFetcher`) for caching, revalidation, and background refresh, so the UI doesn't refetch data it already has.

### Real-time (STOMP / SockJS)

**What it is (simple terms):** normal REST calls only happen when the frontend asks for something ("pull"). But a kitchen screen needs to know the instant a new order comes in, without asking every few seconds ("polling"). WebSockets keep a connection open both ways, so the server can "push" updates to the browser the moment something changes. STOMP is just a simple messaging format on top of that connection (like "subscribe to this channel, publish to that channel"), and SockJS is a fallback so it still works if raw WebSockets are blocked.

**In this project:** `WebSocketConfig.java` registers a `/ws` endpoint with a `/topic` broker. Orders placed from tables or room service publish to `/topic/kitchen`; the kitchen board subscribes via `useWebSocket` and updates live - no polling.

### Role-based access control

**What it is (simple terms):** not every staff member should be able to do everything — a waiter shouldn't edit payroll, and a cook shouldn't see financial reports. RBAC means every user is assigned a **role**, and the system checks that role before allowing an action. The trick is doing this check in two places: the frontend hides things the user shouldn't see (for a clean UI), but the backend also re-checks on every request (for real security) — because a frontend check alone can always be bypassed.

**In this project:** 11 roles, enforced on both sides:

- **Frontend** - `AuthGuard.tsx` / `ProtectedRoute.tsx` guard routes and control sidebar nav
- **Backend** - `SecurityConfig.java` / `JwtAuthenticationFilter.java` check role authorities on every request

---

## Roles

| Role         | Covers                                                           |
| ------------ | ---------------------------------------------------------------- |
| OWNER        | Full admin, analytics, user accounts, audit logs, master pricing |
| MANAGER      | Daily operations, reservations, inventory, reporting, staff      |
| RECEPTIONIST | Check-in/out, bookings, guest directory, folios, payments        |
| WAITER       | Dining floor, table allocation, food orders                      |
| COOK         | Kitchen display system, prep stages, recipes                     |
| ROOM_SERVICE | In-room dining requests and fulfillment                          |
| LAUNDRY      | Linen washing, status tracking, billing                          |
| INVENTORY    | Stock, purchase orders, reorder levels, low-stock alerts         |
| EVENTS       | Banquet scheduling, packages, split billing                      |
| PARKING      | Slot allocation (Zone A/B), fee tracking                         |
| GAME_STAFF   | Game lounge timers and hourly billing                            |

---

## Key Modules

- **Dashboard** - role-specific overview: revenue, check-ins, pending tickets
- **Front Desk & Reservations** - room catalog, occupancy calendar, booking engine, folios
- **Guests** - profiles, ID/passport verification, stay history
- **Folios, Payments & Checkout** - billing, itemized charges, discounts, invoices, settlement
- **Restaurant & Dining Tables** - table map, digital menu, waiter tickets
- **Kitchen Display System** - live board (Queued → Preparing → Ready → Served) over WebSocket
- **Recipes** - repository, prep instructions, ingredients
- **Room Service & Laundry** - service delivery and status, tied to folio billing
- **Events** - multi-venue scheduling, packages, split billing
- **Game Lounge** - hourly session tracking, auto billing
- **Inventory** - stock, suppliers, reorder levels, alerts
- **Parking** - zone/slot allocation, vehicle tracking
- **Pricing** - tariffs for rooms, amenities, venues, dining
- **Reports** - revenue, F&B sales, occupancy, parking income, audit history
- **Audit Logs** - user actions and security events
- **User Management** - staff accounts, roles

---

## Getting Started

### Prerequisites

- Node.js v18+
- Java 17+
- MongoDB (local on `localhost:27017`, or Atlas)

### 1. Backend

```bash
cd server
```

Create `server/.env.local`:

```env
PORT=
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRATION=
OWNER_NAME=
OWNER_EMAIL=
OWNER_PASSWORD=
```

Run it:

```bash
./mvnw spring-boot:run       # Linux/macOS
.\mvnw.cmd spring-boot:run   # Windows
```

API runs at `http://localhost:8080`.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:3000`.
