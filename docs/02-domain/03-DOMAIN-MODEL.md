# Domain Model — Conceptual

## Core Entities

### User

Identity and authentication account.

### FarmerProfile

Additional information for Farmer users.

### BusinessEntity

Verified organization participating in the supply chain.

### Membership

Relationship between User and BusinessEntity with an entity role.

### Product

General product definition.

### Batch

Specific production/harvest lot belonging to a Product.

### Inventory

Current stock position for an owner/location/batch context.

### InventoryMovement

Immutable or append-oriented record describing stock change.

### SupplyTransaction

Purchase/transfer/sale-side business event connecting actors/entities.

### Order

Consumer purchase request/order.

### OrderItem

Product/batch allocation within an Order.

### WasteRecord

Stock reduction caused by waste.

### Attachment

Uploaded image/PDF/document metadata where needed.

## Conceptual Relationships

```text
User 1──0..1 FarmerProfile
User 1──N Membership N──1 BusinessEntity
Product 1──N Batch
Batch 1──N InventoryMovement
Batch 1──N WasteRecord
Batch 1──N SupplyTransaction
Order 1──N OrderItem
OrderItem N──1 Product
OrderItem N──0..1 Batch
```

The final ERD must be normalized and must explicitly demonstrate the project-required One-to-One, One-to-Many, Many-to-One, and Many-to-Many relationships.
