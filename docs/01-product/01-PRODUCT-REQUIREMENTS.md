# Product Requirements Document

## Problem

Agricultural goods can pass through multiple actors before reaching consumers. Without structured records, it becomes difficult to determine the origin of a batch, current stock, ownership changes, price changes, expiry risk, and waste.

## Product Goal

Build a fullstack platform that provides controlled management and traceability of agricultural products throughout the supply chain.

## Core User Journeys

### Farmer

Register → create product/batch → define quantity/quality/expiry → offer/transfer to distributor → view batch history.

### Distributor

Join approved Business Entity → receive/purchase batch → inventory increases → record transfer/sale to retailer → inventory decreases → record waste when applicable.

### Retailer

Join approved Business Entity → receive batch → manage inventory → sell to consumer → record waste.

### Consumer

Register/login → browse available products → view permitted product information → place order → view order status → view permitted traceability.

### Platform Admin

Login → review Business Entity requests → approve/reject → manage platform-level data → inspect audit-relevant activity.

## Functional Requirements

### Authentication

- Register
- Login
- Logout
- Forgot password
- Reset password
- JWT-based authentication
- Protected routes
- Role-based authorization

### Business Entity

- Create request
- Admin approval/rejection
- Entity profile
- Entity membership
- Member role assignment
- Entity status

### Product

- Create
- Read/list/detail
- Update
- Soft delete
- Search
- Filter
- Sort
- Pagination
- Optional product image/document upload

### Batch

- Create
- Read/list/detail
- Update
- Soft delete where appropriate
- Quantity
- Harvest/production date
- Expiry date
- Quality grade
- Current owner
- Current location where needed

### Inventory

- View current stock
- View stock by product
- View stock by batch
- View stock by owner/entity
- Inventory movement history
- Prevent impossible negative stock

### Supply Chain

- Receive/purchase batch
- Transfer batch/quantity between actors
- Record source and destination
- Record transaction price
- Preserve transaction history

### Order / Sale

- Create order
- Order items
- Order status
- Inventory reservation/deduction according to finalized business rules
- Consumer order history

### Waste

- Record waste
- Record batch
- Record quantity
- Record reason
- Record timestamp
- Calculate waste rate
- Include waste in inventory movement/history

### Traceability

- Batch history
- Origin
- Ownership changes
- Supply-chain events
- Quantity changes
- Waste events
- Public/consumer-safe information boundary

## Non-Functional Requirements

- Responsive UI
- Consistent API responses
- Validation on client and server
- Secure authentication
- Role-based authorization
- Pagination/search/filter/sorting
- API documentation
- Error handling
- Soft delete
- Seed data
- Public GitHub monorepo
