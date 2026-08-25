# Database Requirements

## Mandatory Rules From Project Specification

- Minimum 6 main tables.
- Minimum 5 relationships.
- Primary Keys and Foreign Keys.
- Minimum normalization through 3NF.
- `created_at` and `updated_at` on every main table.
- Soft delete on at least 2 tables.
- Minimum 20 seed records for every main table.
- Required relationship types: One-to-One, One-to-Many, Many-to-One, Many-to-Many.

## Recommended Core Tables

The final design is expected to contain more than the minimum because the domain requires separation of concerns.

Candidate tables:

1. users
2. farmer_profiles
3. business_entities
4. memberships
5. products
6. product_categories
7. batches
8. inventories
9. inventory_movements
10. supply_transactions
11. orders
12. order_items
13. waste_records
14. attachments
15. password_reset_tokens / equivalent authentication support

The exact table list will be finalized during ERD design.

## Soft Delete Candidates

Recommended:

- products
- business_entities

Additional candidates may be used if appropriate.

## Seed Data Strategy

Seed data must be realistic enough to demonstrate:

- multiple farmers;
- multiple entities;
- distributors and retailers;
- multiple products;
- multiple batches with different expiry dates;
- inbound/outbound inventory movements;
- different transaction prices;
- waste events;
- consumer orders.

Do not generate 20 meaningless rows merely to satisfy a checkbox. The seed dataset should tell a coherent story during the demo.
