# CICLOVELA — AGENTS.md

This file is the permanent context for AI coding agents across sessions.
Before doing any work, READ THIS FILE and the relevant docs in `/docs`.

---

## 1. PROJECT IDENTITY

**Name:** CICLOVELA
**Type:** Agricultural Supply Chain, Inventory & Product Traceability Platform
**Deadline:** Friday, 18 September 2026, 22:00 WIB
**Repo:** Public GitHub monorepo

CICLOVELA records the lifecycle and movement of agricultural products:

```
Farmer → Distributor → Retailer → Consumer
```

It is NOT: accounting system, marketplace, GPS tracker, ERP, finance app, or social network.

---

## 2. ARCHITECTURE — MICROSERVICES

The backend uses a **microservices** architecture with the following services:

```
backend/
├── api-gateway/
├── auth-service/
├── catalog-service/
├── inventory-service/
├── order-service/
└── traceability-service/
```

Each service is a standalone Spring Boot application connecting to a shared PostgreSQL database.

### Service Responsibilities

| Service | Responsibility |
|---|---|
| **api-gateway** | Routes requests, CORS, JWT validation passthrough |
| **auth-service** | Register, Login, Logout, Forgot/Reset Password, JWT token |
| **catalog-service** | Product, ProductCategory, Batch CRUD, file upload |
| **inventory-service** | InventoryAccount, Inventory, InventoryMovement, Waste, BusinessEntity, Membership |
| **order-service** | Purchase (Farmer→Distributor), Sale (Dist→Retail, Retail→Consumer), PurchaseItem, SaleItem, Delivery, Payment |
| **traceability-service** | Batch history, supply chain timeline, safe public projection |

### Inter-Service Communication

Services share the same PostgreSQL database (shared-database pattern) for MVP simplicity.
No message broker (Kafka/RabbitMQ) for MVP.

---

## 3. TECH STACK

### Backend
- Java 21
- Spring Boot 4.1.x
- Spring Security
- Spring Data JPA / Hibernate
- Bean Validation (jakarta.validation)
- PostgreSQL
- Lombok
- OpenAPI / Swagger (springdoc-openapi)
- Maven

### Frontend
- React
- TypeScript
- Client-side routing (React Router)
- API client layer (Axios or fetch)
- Toast notifications
- Responsive layout (mobile ≤768px, tablet 769-1024px, desktop >1024px)

### Database
- PostgreSQL
- UUID primary keys (gen_random_uuid via pgcrypto)
- VARCHAR for enum values in DB, Java Enum in application layer
- NO PostgreSQL native ENUM
- Hibernate ddl-auto: `validate` (schema managed by SQL script)

---

## 4. DATABASE SCHEMA

### Tables (16 tables)

| # | Table | Soft Delete | Relationships |
|---|---|---|---|
| 1 | users | yes (deleted_at) | 1:1 with farmer concept (via role), FK from memberships |
| 2 | business_entities | yes (deleted_at) | 1:N memberships, FK created_by/approved_by → users |
| 3 | business_memberships | yes (deleted_at) | N:1 users, N:1 business_entities (Many-to-Many resolver) |
| 4 | product_categories | yes (deleted_at) | 1:N products |
| 5 | products | yes (deleted_at) | N:1 product_categories, 1:N batches |
| 6 | batches | yes (deleted_at) | N:1 products, N:1 users(farmer), 1:N inventories |
| 7 | inventory_accounts | no | N:1 users OR N:1 business_entities (exclusive) |
| 8 | inventories | no | N:1 inventory_accounts, N:1 batches, 1:N movements |
| 9 | inventory_movements | no (immutable) | N:1 inventories, N:1 users(created_by) |
| 10 | purchases | no | N:1 business_entities(buyer), N:1 users(seller/farmer) |
| 11 | purchase_items | no | N:1 purchases, N:1 batches |
| 12 | sales | no | N:1 business_entities(seller), N:1 business_entities OR users(buyer) |
| 13 | sale_items | no | N:1 sales, N:1 batches |
| 14 | wastes | no | N:1 batches, N:1 inventories, N:1 users(recorded_by) |
| 15 | deliveries | no | 1:1 sales |
| 16 | payments | no | N:1 sales |

### Required Relationship Types
- **One-to-One:** deliveries ↔ sales
- **One-to-Many:** products → batches, purchases → purchase_items, sales → sale_items
- **Many-to-One:** batches → products, inventories → inventory_accounts
- **Many-to-Many:** users ↔ business_entities (via business_memberships)

### Key Constraints
- `created_at` and `updated_at` on every main table (auto-trigger)
- Soft delete on: users, business_entities, products (min 2 required)
- Inventory quantity >= 0
- reserved_quantity <= quantity
- Inventory movements are IMMUTABLE (trigger prevents UPDATE/DELETE)
- Batch expiry_date >= harvest_date
- initial_quantity never changes after creation
- Seed data: min 20 rows per main table

### SQL Script
Schema is defined in: `docs/04-database/ciclovela_db.sql`

---

## 5. ROLES & RBAC

### Platform Roles (stored in users.role)
| Role | Description |
|---|---|
| PLATFORM_ADMIN | Manages platform, approves Business Entities |
| FARMER | Creates products/batches, sells to distributors |
| CONSUMER | Browses products, places orders |

### Entity Roles (stored in business_memberships.role)
| Role | Description |
|---|---|
| ENTITY_ADMIN | Manages Business Entity profile and members |
| DISTRIBUTOR | Receives from farmers, sells to retailers |
| RETAILER | Receives from distributors, sells to consumers |
| STAFF | Support role within entity |

### Key Rules
- Farmer and Consumer operate as personal users
- Distributor and Retailer MUST operate under an approved Business Entity
- Business Entity must be approved by PLATFORM_ADMIN before operations
- Authorization is enforced SERVER-SIDE (frontend is UX-only)

---

## 6. SUPPLY CHAIN FLOW (MVP)

```
FARMER → DISTRIBUTOR → RETAILER → CONSUMER
```

**NOT allowed in MVP:**
- Farmer → Retailer (skip distributor)
- Farmer → Consumer (skip all)
- Distributor → Consumer (skip retailer)

### Transaction Types
- **Purchase:** Farmer → Distributor (via purchases/purchase_items)
- **Sale (B2B):** Distributor → Retailer (via sales/sale_items)
- **Sale (B2C):** Retailer → Consumer (via sales/sale_items)

### Transaction Status Flow
```
PENDING → CONFIRMED → COMPLETED
                   → CANCELLED
```

Purchase does NOT immediately add inventory. Inventory changes when status reaches COMPLETED.

---

## 7. INVENTORY RULES

Inventory is BATCH-BASED, not product-based.

```
Product → Batch → Inventory → InventoryMovement
```

### Movement Types
| Type | Direction | Trigger |
|---|---|---|
| PURCHASE_IN | + | Purchase completed |
| TRANSFER_IN | + | Received from another entity |
| TRANSFER_OUT | - | Sent to another entity |
| SALE_OUT | - | Sale completed |
| WASTE_OUT | - | Waste recorded |
| ADJUSTMENT_IN | + | Manual correction |
| ADJUSTMENT_OUT | - | Manual correction |
| REVERSAL_IN | + | Transaction cancellation |
| REVERSAL_OUT | - | Transaction cancellation |

### Formula
```
Current Stock = Opening + Inbound - Outbound - Waste + Adjustments
```

### Non-Negotiable
- Inventory can NEVER be negative
- Every inventory change MUST create an InventoryMovement record
- InventoryMovement records are IMMUTABLE
- Expired batches cannot be used for new sales
- Waste does NOT change batch initial_quantity

---

## 8. WASTE RULES

Waste is a FIRST-CLASS business feature.

- Must reference: batch, inventory, quantity, reason, actor, timestamp
- Waste reduces inventory via WASTE_OUT movement
- Cannot exceed available inventory
- Does NOT change batch initial_quantity
- Expired products stay in inventory until waste is recorded

### Waste Reasons (enum)
EXPIRED, SPOILED, DAMAGED, QUALITY_FAILURE, UNSOLD, OTHER

---

## 9. API CONVENTIONS

### REST Standard
All services expose REST endpoints: GET, POST, PUT, PATCH, DELETE

### Base Path
```
/api/{resource}
```

### Response Format
Success:
```json
{
  "success": true,
  "message": "...",
  "data": {},
  "meta": {}
}
```

Error:
```json
{
  "success": false,
  "message": "...",
  "errors": [{"field": "name", "message": "Name is required"}],
  "timestamp": "..."
}
```

### Status Codes
200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Validation Error, 500 Internal Server Error

### List Endpoints Must Support
- search: `?search=keyword`
- filter: `?status=ACTIVE&category=uuid`
- sort: `?sort=name,asc`
- pagination: `?page=1&limit=10`

### Endpoint Families
```
/auth          (auth-service)
/users         (auth-service)
/business-entities   (inventory-service)
/memberships         (inventory-service)
/products            (catalog-service)
/categories          (catalog-service)
/batches             (catalog-service)
/inventories         (inventory-service)
/inventory-movements (inventory-service)
/purchases           (order-service)
/sales               (order-service)
/waste-records       (inventory-service)
/traceability        (traceability-service)
/attachments         (catalog-service)
/deliveries          (order-service)
/payments            (order-service)
```

---

## 10. FRONTEND REQUIREMENTS

### Auth Flow
- Login, Register, Logout, Forgot Password, Reset Password
- JWT stored in localStorage or Cookie
- Session survives browser refresh
- Logout clears all auth data

### Routing
- Public routes (landing, login, register, forgot/reset password)
- Private routes (authenticated only)
- Role routes (role-specific access)
- Redirect on unauthorized access

### Dashboard
- Real data from backend (NOT static)
- Card summary, total data, statistics, recent activity

### CRUD Interface (for each main entity)
- List, Detail, Create, Edit, Delete
- All connected to API

### Search, Filter, Sort
- Search by keyword
- Filter by status, category, date
- Sort: newest, oldest, A-Z, Z-A
- All combinable

### Pagination
- Previous, Next, Page numbers
- Total data count
- Items per page selector

### Upload
- Image and PDF support

### Form Validation (client-side, real-time)
- Required, min/max length, email format, phone, password confirmation

### Notifications
- Toast: success, error, warning, info

### Error Pages
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 500 Internal Server Error
- API failure fallback

### Core Screens by Role

**Public:** Landing, Login, Register, Forgot/Reset Password

**Platform Admin:** Dashboard, Business Entity requests/management, Users, Reference data

**Farmer:** Dashboard, Products, Batches, Inventory, Supply transactions, Waste, Traceability

**Distributor:** Dashboard, Incoming supply, Inventory, Transfers/Sales, Waste, Batch traceability

**Retailer:** Dashboard, Incoming supply, Inventory, Orders/Sales, Waste, Traceability

**Consumer:** Product catalog, Product detail, Orders, Traceability

---

## 11. SECURITY

- Password hashing (BCrypt)
- JWT authentication
- CORS configured for frontend origin
- Server-side validation on all POST/PUT/PATCH
- SQL injection prevention (JPA parameterized queries)
- File upload: accepted types only, size limits, safe filenames
- XSS protection (optional/P1)

---

## 12. PRIORITY (P0 > P1 > P2)

### P0 — Must Exist (MVP)
1. Authentication flow (register, login, logout, forgot/reset password)
2. Platform Admin + RBAC
3. Business Entity approval
4. Farmer personal account
5. Distributor/Retailer membership under Business Entity
6. Product CRUD
7. Batch CRUD
8. Inventory
9. Inventory movement ledger
10. Purchase/receive/transfer flow
11. Order/sale flow
12. Waste recording
13. Batch traceability
14. Search/filter/sort/pagination
15. Upload image/PDF
16. Validation and notifications
17. Global error handling
18. Database design (16 tables, 5+ relations)
19. API documentation (Swagger)
20. README, flowcharts, seed data

### P1 — If P0 Stable
- Dashboard charts
- Price history
- Waste analytics
- Inventory aging
- Low-stock/expiry warnings
- Entity reports
- Email service for reset password

### P2 — Stretch Goals
- Midtrans payment gateway
- Delivery status workflow
- QR code traceability
- Public batch page

---

## 13. RENCANA 21 HARI (STATUS TERKINI)

| Hari | Fokus | Status |
|---|---|---|
| 1 | Finalisasi kebutuhan, setup monorepo | SELESAI |
| 2 | ERD & Database (schema, constraint, index, seed strategy) | SELESAI |
| 3 | Backend Skeleton (Spring Boot, koneksi DB, struktur project) | SELESAI |
| 4 | Authentication (Register, Login, JWT, Logout, Forgot/Reset Password) | SELESAI |
| 5 | RBAC & Business Entity (Roles, Membership, Approval Admin) | SELESAI |
| 6 | Product & Category (CRUD, validasi, search/filter/sort/pagination) | SELESAI |
| 7 | Batch (CRUD, expiry, quality, quantity, ownership) | SELESAI |
| 8 | Inventory Core (Model, Movement, Inbound/Outbound, Waste) | SELESAI |
| 9 | Supply Transactions (Purchase, Transfer, Price capture) | SELESAI |
| 10 | Orders/Sales (Order, Order Items, Inventory effect) | SELESAI |
| 11 | Waste (Waste records, Reasons, Inventory effect) | SELESAI |
| 12 | Traceability (Batch history, Supply chain timeline) | SELESAI |
| **13** | **Frontend Foundation (React, Routing, Auth state, API client, Layout)** | **SEDANG DIKERJAKAN** |
| 14 | Frontend Auth UI & Role Routes (Login, Register, Error pages) | BELUM |
| 15 | Frontend Product/Batch UI (List, Detail, Create, Edit, Delete) | BELUM |
| 16 | Frontend Inventory/Supply UI (Inventory, Movement, Receive, Transfer) | BELUM |
| 17 | Frontend Orders/Waste/Traceability UI + Notifikasi | BELUM |
| 18 | Dashboard & fitur P1 (Metrik, Aktivitas terbaru, Expiry/Waste) | BELUM |
| 19 | Integrasi & Seed Data (20+ data per tabel, End-to-end flow) | BELUM |
| 20 | Testing & Deployment (Security check, Swagger, Deploy, README, Flowchart) | BELUM |
| 21 | Submission Freeze (Fix critical bugs, Verifikasi deployment & demo) | BELUM |

---

## 14. DEVELOPMENT RULES

1. Read docs before implementing
2. Do NOT invent business rules not in docs
3. Do NOT change DB schema without updating docs
4. Do NOT bypass service/business rules from controllers
5. Do NOT trust frontend authorization (backend is authoritative)
6. Do NOT hard-delete entities that use soft delete
7. Do NOT implement P2 while P0 is incomplete
8. Do NOT introduce unnecessary dependencies
9. Do NOT create dummy CRUD to satisfy checklist
10. Prefer simple, maintainable code over clever abstractions

---

## 15. NAMING CONVENTIONS

- **Java classes:** PascalCase (ProductService, BatchController)
- **Database tables/columns:** snake_case (business_entities, created_at)
- **API JSON:** consistent camelCase
- **REST endpoints:** kebab-case (/api/business-entities, /api/waste-records)
- **Packages:** com.ciclovela.{service}.{layer} (e.g., com.ciclovela.auth.controller)

---

## 16. COMMANDS

### Backend (per service)
```bash
# Build
cd backend/{service-name}
./mvnw clean package

# Run
./mvnw spring-boot:run

# Test
./mvnw test
```

### Frontend
```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
```

---

## 17. CURRENT STATUS

- Project concept: FIXED
- Project name: FIXED
- Core domain: FIXED
- Database schema SQL: DONE (docs/04-database/ciclovela_db.sql)
- **auth-service**: DONE (Tested, endpoints active, JWT working)
- **catalog-service**: DONE (Tested, Product & Batch CRUD working)
- **inventory-service**: DONE (Tested, BusinessEntity, Inventory, Waste working)
- **order-service**: DONE (Tested, Purchase & Sale logic changing inventory working)
- **traceability-service**: DONE (Tested, Timeline read-only views working)
- **api-gateway**: SKELETON CREATED, Needs routing setup.
- Frontend: NOT STARTED (empty directory)

We are currently at **Day 7** of the 10-day condensed plan. All core backend microservices are implemented and manually verified end-to-end. Next steps involve finishing the API Gateway and starting the Frontend.

---

## 18. SUBMISSION CHECKLIST

- [ ] Frontend + Backend in one public GitHub monorepo
- [ ] README.md (title, description, features, tech stack, folder structure, install/run instructions)
- [ ] Demo accounts (username/password)
- [ ] Flowchart documentation
- [ ] Swagger/OpenAPI documentation
- [ ] Seed data (20+ per main table)
- [ ] Deployed frontend (Vercel/Netlify)
- [ ] Submit via Google Form: https://forms.gle/TeMvXvpMzH1v93vNA
- [ ] Deadline: Friday 18 September 2026, 22:00 WIB
