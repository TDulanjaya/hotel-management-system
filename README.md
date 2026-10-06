# LuxeStay - Hotel Management System

A full-stack Property Management System (PMS) built with Next.js, Spring Boot, and MongoDB.

---

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, SWR
- **Backend:** Spring Boot, Java 17+, Spring Security (JWT)
- **Database:** MongoDB
- **Real-time:** WebSockets (STOMP / SockJS)

---

## Environment Variables

Create `.env.local` in both project folders:

### Backend (`server/.env.local`)
```env
MONGODB_URI=
MONGODB_DATABASE=
JWT_SECRET=
JWT_EXPIRATION_MS=
```

### Frontend (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL=
```

---

## Quick Start

### 1. Run Backend
```bash
cd server
.\mvnw.cmd spring-boot:run   # Windows
./mvnw spring-boot:run       # Linux / macOS
```
*Runs on `http://localhost:8080`*

### 2. Run Frontend
```bash
cd client
npm install
npm run dev
```
*Runs on `http://localhost:3000`*

---

## Core Concepts

- **REST API:** 23 controllers exposing clean endpoints (`GET`, `POST`, `PUT`, `DELETE`) with input validation and standard status codes.
- **BFF (Backend-for-Frontend):** Centralized API layer (`client/src/lib/api/*`) that attaches JWT tokens, handles 401s globally, and normalizes responses before reaching UI components.
- **Real-time (STOMP / SockJS):** Live order updates pushed to the kitchen board via `/topic/kitchen` without polling.
- **Role-Based Access (RBAC):** Double-layer protection — UI hides unauthorized menus, while backend filters verify JWT roles on every request.

---

## Roles

- **OWNER** – Full control, system settings, staff management, audit logs
- **MANAGER** – Daily operations, reservations, reports, inventory
- **RECEPTIONIST** – Bookings, guest check-in/out, folios & billing
- **WAITER** – Table allocation & food orders
- **COOK** – Live Kitchen Display System (KDS)
- **ROOM_SERVICE** – In-room orders & delivery
- **LAUNDRY** – Laundry tracking & charges
- **INVENTORY** – Stock levels & purchase orders
- **EVENTS** – Venue bookings & packages
- **PARKING** – Vehicle slot allocation & billing
- **GAME_STAFF** – Game lounge timers & billing
