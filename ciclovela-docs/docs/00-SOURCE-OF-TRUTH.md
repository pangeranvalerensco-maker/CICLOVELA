# CICLOVELA — SOURCE OF TRUTH

This document is the canonical reference for CICLOVELA.

Any developer, AI coding agent, reviewer, or contributor must read and follow this document before modifying the system.

If an implementation conflicts with this document, the implementation must be changed unless the requirement itself has been formally revised and documented.

AI-generated suggestions do not override approved CICLOVELA requirements.

## 1. Fixed Identity

**Project:** CICLOVELA

**Working title:** Agricultural Supply Chain, Inventory & Product Traceability Platform

**Core thesis:** CICLOVELA records the lifecycle and movement of agricultural products across Farmer → Distributor → Retailer → Consumer while preserving inventory history, batch information, ownership, value, expiry, and waste records.

## 2. What CICLOVELA Is

CICLOVELA is a controlled supply-chain and inventory platform.

The primary business question is:

> Where did this product come from, where is it now, how much remains, what happened to it, what value was attached to it at each stage, and what portion became waste?

## 3. What CICLOVELA Is Not

- Not a pure accounting application.
- Not a general organization-management system.
- Not a pure marketplace.
- Not a real-time courier/GPS application.
- Not a tax application.
- Not a banking application.
- Not an unrestricted social network.

Payment integration and delivery status may exist as supporting features, but they do not redefine the core product.

## 4. Fixed Actors

### Platform Admin

Operates the CICLOVELA platform. Responsible for platform-level moderation and Business Entity approval.

### Farmer

A personal user who can register agricultural products/batches and offer goods into the supply chain. Farmer does not need to belong to a Business Entity in the MVP.

### Business Entity

A verified organization representing a distributor, retailer, or other business participant.

### Entity Admin

Manages members and operational data within a Business Entity. This is distinct from Platform Admin.

### Distributor

Must operate under a Business Entity. Purchases/receives products from Farmers and can transfer/sell them onward.

### Retailer

Must operate under a Business Entity. Purchases/receives products from distributors and sells to consumers.

### Consumer

Personal user who can browse products, place orders, and view permitted traceability information.

## 5. Fixed Lifecycle

```text
Farmer
  ↓
Product / Batch
  ↓
Distributor
  ↓
Retailer
  ↓
Consumer
  ↓
Product End-of-Life / Waste
```

The lifecycle is batch-aware. A Product is a general product definition; a Batch represents a specific production/harvest lot with its own quantity, dates, quality, ownership, and expiry.

## 6. Fixed Core Domains

1. Identity & access
2. Business Entity
3. Product
4. Batch
5. Inventory
6. Inventory Movement
7. Supply-chain transaction / transfer
8. Order / sale
9. Waste
10. Traceability

Supporting domains:

11. Payment
12. Delivery
13. Notification
14. Analytics / dashboard

Supporting domains are lower priority than the core domains.

## 7. Non-Negotiable Business Principles

- Inventory must be explainable through movements.
- Batch information must be preserved.
- Expiry can differ between batches of the same product.
- Waste is a first-class business event, not a note field.
- Ownership changes must be traceable.
- Price changes between supply-chain stages must be recorded rather than silently overwritten.
- Role permissions must be enforced server-side.
- Business Entity creation must be controlled/approved by Platform Admin.
- Consumer-facing traceability must not expose sensitive internal business data.
- Deleted master data must be recoverable through soft delete where required by the project rules.

## 8. Scope Philosophy

The MVP must be deep and coherent rather than broad and unfinished.

Priority order:

**P0:** authentication, authorization, entities, products, batches, inventory, movement, transfers, orders/sales, waste, traceability, required project infrastructure.

**P1:** dashboard analytics, price history, advanced filters, reports, notifications, richer traceability.

**P2:** Midtrans/payment gateway, delivery workflow, QR/public traceability page, advanced analytics/recommendations.

## 9. Change Control

Any proposed feature must answer:

1. Which business problem does it solve?
2. Which actor uses it?
3. Which domain entity does it affect?
4. Which business rules does it introduce?
5. Does it threaten the three-week schedule?
6. Is it P0, P1, or P2?

If it does not improve the core lifecycle, it is probably not a priority.
Non-Negotiable Rules

Business Structure

Farmer dapat beroperasi sebagai personal user.
Distributor wajib berada di dalam Business Entity.
Retailer wajib berada di dalam Business Entity.
Consumer dapat beroperasi sebagai personal user.
Business Entity baru dapat digunakan setelah approval Platform Admin.
Distributor dan Retailer memperoleh kewenangan melalui Business Membership, bukan role bebas yang dapat dipilih tanpa konteks entity.

Supply Chain

FARMER
   ↓
DISTRIBUTOR
   ↓
RETAILER
   ↓
CONSUMER

Alur tersebut merupakan alur utama dan wajib untuk MVP.

Tidak diperbolehkan pada MVP:

Farmer → Retailer
Farmer → Consumer
Distributor → Consumer

Product & Batch

Product merepresentasikan jenis produk.
Batch merepresentasikan kelompok produksi/panen tertentu.
Product dapat memiliki banyak Batch.
Batch memiliki quantity awal, quality grade, harvest date, dan expiry date.
Perubahan ownership tidak membuat Batch baru.
Satu Batch dapat tersebar pada beberapa Inventory Account.
Sebagian quantity Batch dapat dijual atau dipindahkan.

Inventory

Inventory tidak boleh negatif.
reserved_quantity tidak boleh lebih besar daripada quantity.
Perubahan inventory wajib menghasilkan Inventory Movement.
Historical Inventory Movement tidak boleh diedit.
Transaksi yang perlu dibatalkan harus menggunakan reversal/cancellation mechanism.
Quantity awal Batch tidak boleh diubah akibat transaksi atau waste.

Waste

Waste merupakan core feature.
Waste harus memiliki quantity, batch, inventory, reason, actor, dan timestamp.
Waste tidak boleh melebihi available inventory.
Waste menghasilkan WASTE_OUT Inventory Movement.
Waste tidak mengubah initial_quantity Batch.
Expired product tidak otomatis dihapus dari inventory tanpa pencatatan waste.

Expiry

Batch yang telah expired tidak boleh digunakan untuk transaksi penjualan baru.
Expired stock tetap dapat tercatat di inventory sampai dilakukan waste handling.
Expiry harus ditentukan pada level Batch, bukan Product.

Transaction

Purchase tidak langsung menambah inventory ketika dibuat.
Inventory berpindah setelah Purchase mencapai status yang sesuai.
Sale tidak boleh mengurangi inventory yang tidak tersedia.
Completed transaction tidak boleh dihapus secara fisik.
Historical transaction harus tetap dapat ditelusuri.

Scope

CICLOVELA bukan:

accounting system;
personal finance application;
marketplace umum;
realtime delivery tracking system;
GPS logistics platform;
full ERP.

CICLOVELA adalah:

Supply chain, inventory, product traceability, and waste management platform for agricultural products.

Payment gateway seperti Midtrans dan fitur delivery lebih lanjut berada pada optional/P2 scope dan tidak boleh menghambat penyelesaian core system.