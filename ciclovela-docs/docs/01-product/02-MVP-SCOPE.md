# MVP Scope & Priority

## P0 — Must Exist

1. Authentication flow required by the rules.
2. Platform Admin and role-based authorization.
3. Business Entity approval.
4. Farmer personal account.
5. Distributor/Retailer membership under Business Entity.
6. Product CRUD.
7. Batch CRUD.
8. Inventory.
9. Inventory movement ledger.
10. Purchase/receive/transfer flow.
11. Order/sale flow.
12. Waste recording and calculation.
13. Batch traceability.
14. Search/filter/sort/pagination.
15. Upload image/PDF.
16. Validation and notifications.
17. Global error handling.
18. Required relational database design.
19. API documentation.
20. README, flowcharts, seed data, GitHub monorepo.

## P1 — Implement If P0 Is Stable

- Dashboard charts.
- Price history and margin visibility.
- Advanced waste analytics.
- Inventory aging.
- Low-stock/expiry warnings.
- Entity reports.
- Richer public traceability.
- Email service for reset password if not handled by another accepted implementation.

## P2 — Stretch Goals

- Midtrans payment gateway.
- Delivery status workflow.
- QR code for batch traceability.
- Public batch page.
- Recommendation/demand analysis.
- Advanced forecasting.

## Explicit Scope Cuts

Do not implement real-time GPS delivery tracking, complex accounting statements, banking/payment wallets, social features, or a full marketplace unless all P0 requirements are already complete and tested.
