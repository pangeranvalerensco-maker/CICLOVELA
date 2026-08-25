# 21-Day Implementation Plan

The official project deadline in the provided specification is Friday, 18 September 2026 at 22:00 WIB. The schedule below deliberately aims to finish the functional build before the deadline so the final days are not spent praying to Git merge conflicts.

## Day 1 — Freeze Requirements

- Read all docs.
- Freeze stack.
- Freeze roles.
- Freeze P0 scope.
- Freeze domain vocabulary.
- Create GitHub repository and monorepo.

## Day 2 — ERD & Database

- Final ERD.
- Constraints.
- Indexes.
- Timestamp fields.
- Soft delete.
- Seed strategy.

## Day 3 — Backend Skeleton

- Spring Boot.
- PostgreSQL connection.
- Project structure.
- Global response/error handling.
- OpenAPI.

## Day 4 — Authentication

- Register.
- Login.
- JWT.
- Logout.
- Forgot/reset password flow.

## Day 5 — RBAC & Business Entity

- Roles.
- Membership.
- Entity creation request.
- Admin approval.

## Day 6 — Product & Category

- CRUD.
- Validation.
- Search/filter/sort/pagination.
- Upload support.

## Day 7 — Batch

- Batch CRUD.
- Expiry.
- Quality.
- Quantity.
- Ownership.

## Day 8 — Inventory Core

- Inventory model.
- Inventory movement.
- Inbound/outbound rules.
- Consistency tests.

## Day 9 — Supply Transactions

- Receive/purchase.
- Transfer.
- Price capture.
- Ownership changes.

## Day 10 — Orders/Sales

- Order.
- Order items.
- Inventory effect.
- Permissions.

## Day 11 — Waste

- Waste records.
- Reasons.
- Inventory effect.
- Waste rate.

## Day 12 — Traceability

- Batch history.
- Supply chain timeline.
- Safe public/internal projection.

## Day 13 — Frontend Foundation

- React app.
- Routing.
- Auth state.
- API client.
- Layout.
- Responsive foundation.

## Day 14 — Auth & Roles UI

- Login/register.
- Forgot/reset.
- Private routes.
- Role routes.
- Error pages.

## Day 15 — Product/Batch UI

- List/detail/create/edit/delete.
- Search/filter/sort.
- Pagination.
- Validation.

## Day 16 — Inventory/Supply UI

- Inventory.
- Movement history.
- Receive.
- Transfer.

## Day 17 — Orders/Waste/Traceability UI

- Orders.
- Waste.
- Traceability.
- Notifications.

## Day 18 — Dashboard & P1

- Real backend metrics.
- Recent activity.
- Expiry/waste indicators.
- Price history if stable.

## Day 19 — Integration & Seed

- 20+ coherent seed rows per main table.
- End-to-end flows.
- Fix data integrity issues.

## Day 20 — Testing & Deployment

- Full test pass.
- Security check.
- Swagger.
- Deployment.
- README.
- Flowcharts.

## Day 21 — Submission Freeze

- No major new features.
- Fix critical bugs only.
- Verify GitHub public access.
- Verify frontend/backend deployment.
- Verify README.
- Verify demo accounts.
- Verify documentation.
- Final presentation/demo rehearsal.

## After Day 21 / Buffer

Use remaining time only for critical bug fixes, deployment issues, and optional P1/P2 improvements that do not destabilize the core.
