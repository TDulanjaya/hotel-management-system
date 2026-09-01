# LuxeStay - Hotel Management System

A full-stack Hotel Management System built with Next.js, Spring Boot, and MongoDB. The system manages hotel operations including room reservations, guest check-in, dining tables, kitchen orders, inventory, event bookings, parking, and reporting.

---

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, SWR, Framer Motion, Lucide Icons
- **Backend**: Spring Boot 4, Java 17, Spring Security (JWT), Spring Data MongoDB
- **Database**: MongoDB

---

## Key Modules

- **Dashboard**: Role-based operational overview and key business metrics.
- **Rooms & Reservations**: Room catalog management, live occupancy status, booking engine, and guest folios.
- **Guests**: Guest records, ID/passport details, and stay histories.
- **Restaurant & Kitchen**: Dining table management, menu pricing, food ordering, and real-time kitchen order tickets (KOT).
- **Room Service & Laundry**: Guest service orders and laundry processing.
- **Inventory**: Stock item tracking, reorder levels, and low-stock alerts.
- **Events**: Banquet venue scheduling and master ledger billing.
- **Parking**: Slot allocation (Zone A/B) and vehicle services.
- **Game Lounge**: Hourly game session tracking and billing.
- **Reports**: Financial analytics, daily revenue, food sales, parking income, and system audit logs.
- **User Management**: Staff accounts with role-based access control (RBAC).

---

## Roles

The system supports role-based access control for:

- OWNER
- MANAGER
- RECEPTIONIST
- WAITER
- COOK
- ROOM_SERVICE
- LAUNDRY
- INVENTORY
- EVENTS
- PARKING

---

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- Java JDK 17
- MongoDB running on `localhost:27017`

---

### 1. Backend Setup

1. Open a terminal and navigate to the `server` directory:

   ```bash
   cd server
   ```

2. Create a `.env.local` file in the `server` directory with the following configuration:

   ```env
   PORT=8080
   MONGODB_URI=mongodb://localhost:27017/luxestay_db
   JWT_SECRET=YourSuperSecretKeyWithAtLeast256BitsForJWTSigning
   JWT_EXPIRATION=86400000
   OWNER_NAME=System Owner
   OWNER_EMAIL=owner@luxestay.com
   OWNER_PASSWORD=Owner12345
   ```

3. Start the Spring Boot backend:

   ```bash
   # Windows
   .\mvnw.cmd spring-boot:run

   # Linux / macOS
   ./mvnw spring-boot:run
   ```

   The backend API will run at `http://localhost:8080`.

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `client` directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The web application will run at `http://localhost:3000`.

---

## Default Credentials

An initial Owner account is automatically initialized from `.env.local` if no owner exists:

- **Email**: `owner@luxestay.com`
- **Password**: `Owner12345`

---

## License

This project is licensed under the MIT License.
