# Actors, Roles & RBAC

## Platform Roles

### PLATFORM_ADMIN

Can:
- review Business Entity creation requests;
- approve/reject entities;
- manage platform-level reference data;
- inspect platform activity;
- access administrative dashboards.

### FARMER

Can:
- manage own farmer profile;
- manage own products/batches according to ownership rules;
- offer/transfer goods into the supply chain;
- inspect own inventory/history.

### CONSUMER

Can:
- browse permitted products;
- create orders;
- view own orders;
- view permitted traceability.

### ENTITY_ADMIN

Can:
- manage Business Entity profile;
- manage members;
- assign permitted entity roles;
- manage entity operational data.

### DISTRIBUTOR

Can:
- receive/purchase goods;
- manage entity inventory;
- transfer/sell goods onward;
- record permitted waste;
- inspect relevant batch history.

### RETAILER

Can:
- receive goods;
- manage retail inventory;
- sell goods;
- record permitted waste;
- inspect relevant batch history.

## Registration Rules

1. All people begin as a user account.
2. Farmer may operate as a personal role.
3. Consumer may operate as a personal role.
4. Distributor and Retailer must operate under a Business Entity.
5. Business Entity creation requires Platform Admin approval.
6. A user must not gain distributor/retailer privileges simply by changing a client-side role value.
7. Authorization is enforced in the backend.

## Entity Membership

Recommended conceptual model:

```text
User ──< Membership >── BusinessEntity
                    │
                    └── EntityRole
```

This permits a user to belong to an entity with a defined role without hard-coding all business roles directly into the User table.
