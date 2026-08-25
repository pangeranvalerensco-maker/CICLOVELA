# Test Plan

## Critical Business Scenarios

### Scenario 1 — Farmer Creates Batch

Farmer creates Product → creates Batch → quantity and expiry are stored → inventory/movement is initialized according to the finalized model.

### Scenario 2 — Distributor Receives Batch

Distributor receives a permitted quantity → transaction recorded → inventory increases → movement recorded.

### Scenario 3 — Distributor Transfers to Retailer

Distributor transfers quantity → ownership/source/destination recorded → distributor stock decreases → retailer stock increases.

### Scenario 4 — Retailer Sells

Retailer creates sale/order → inventory decreases according to finalized order rules → transaction history preserved.

### Scenario 5 — Waste

User records waste → batch and quantity validated → inventory decreases → waste record exists → traceability reflects event.

### Scenario 6 — Expiry Difference

Two batches of the same product have different expiry dates. The UI/API must preserve the difference.

### Scenario 7 — Unauthorized Access

Consumer attempts distributor-only operation → 403.

### Scenario 8 — Entity Approval

User requests Business Entity → Platform Admin approves → entity becomes active → permitted membership operations become available.

## Technical Tests

- authentication;
- authorization;
- CRUD;
- validation;
- pagination;
- search/filter/sorting;
- file upload;
- error handling;
- soft delete;
- inventory consistency;
- API documentation endpoints.
