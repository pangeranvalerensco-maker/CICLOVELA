# CICLOVELA - AI DEVELOPMENT CONTEXT

## IMPORTANT

This document is the permanent project context for AI coding agents.

Before modifying, creating, deleting, or refactoring code,
the AI agent MUST read this document and the relevant documents
inside /docs.

The AI MUST NOT invent business requirements.

If a requirement is unclear or conflicts with existing documentation,
STOP and report the conflict before implementing it.

---

# 1. PROJECT IDENTITY

Project name: CICLOVELA

CICLOVELA is an agribusiness supply-chain and inventory management
system focused on agricultural products.

The system connects:

Farmer
    ↓
Distributor
    ↓
Retailer
    ↓
Consumer

The project is NOT a pure accounting system.

The project is NOT a generic marketplace.

The project is NOT a generic organizational management system.

The main focus is:

- agricultural product traceability
- inventory management
- batch management
- expiry management
- supply-chain transactions
- waste management
- business entity verification
- price transparency

# 2. CORE CONCEPT

The inventory system is one of the core features of CICLOVELA.

Inventory must not be treated as a simple integer stock field.

Every inventory quantity must be associated with a product batch.

A batch has:

- batch code
- product
- farmer
- harvest date
- initial quantity
- unit
- quality grade
- expiry date
- status

Different batches of the same product may have different:

- quantities
- harvest dates
- expiry dates
- quality grades
- purchase prices

# 3. SUPPLY CHAIN

FARMER
  ↓
DISTRIBUTOR
  ↓
RETAILER
  ↓
CONSUMER

Farmer can operate as an individual user.

Distributor must operate through an approved Business Entity.

Retailer must operate through an approved Business Entity.

Consumer can operate as an individual user.

A business entity must be approved before it can perform
business transactions.

# 4. DO NOT ASSUME

The following must NOT be assumed by the AI:

- Do not create a warehouse entity unless documented.
- Do not create supplier entity unless documented.
- Do not create employee management unless documented.
- Do not turn CICLOVELA into an accounting system.
- Do not add cryptocurrency/blockchain features.
- Do not add unnecessary microservices.
- Do not add real-time delivery tracking unless documented.
- Do not integrate Midtrans before the payment phase is approved.
- Do not add entities simply because they are common in marketplace systems.