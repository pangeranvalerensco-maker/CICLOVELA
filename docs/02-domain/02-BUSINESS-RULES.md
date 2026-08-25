# Business Rules

## Product vs Batch

A Product is the general definition. A Batch is a specific lot.

One Product can have many Batches.

Example:

```text
Product: Tomato
├── Batch A — harvested 20 Aug — expires 27 Aug
└── Batch B — harvested 22 Aug — expires 30 Aug
```

Expiry must be stored at batch level when it can vary by production/harvest.

## Inventory Rule

Current inventory must be explainable from inventory movements.

Conceptual formula:

```text
Current Stock = Opening + Inbound - Outbound - Waste + Adjustments
```

The exact movement types must be finalized in the domain model before implementation.

## Ownership Rule

A transfer represents a controlled change or movement of goods from source actor/entity to destination actor/entity.

The system must record:

- source;
- destination;
- batch;
- quantity;
- unit;
- transaction time;
- transaction price where applicable;
- status.

## Price Rule

CICLOVELA does not enforce a single market price.

It records transaction values so the system can show how product value changes through the chain.

Example:

```text
Farmer → Distributor: Rp10,000/kg
Distributor → Retailer: Rp14,000/kg
Retailer → Consumer: Rp20,000/kg
```

The system records these as separate transactions, not by overwriting the original price.

## Waste Rule

Waste is a stock-reducing business event.

Waste must reference a batch and quantity.

Waste reasons should be enumerated, e.g.:

- EXPIRED
- SPOILED
- DAMAGED
- QUALITY_FAILURE
- UNSOLD
- OTHER

Waste must be reflected in inventory history.

## Expiry Rule

Expiry risk is batch-specific. The system must not assume that all units of a Product expire on the same date.

## Traceability Rule

The system must be able to reconstruct the relevant history of a batch from origin through subsequent supply-chain events.

## Data Visibility Rule

Internal transaction values and personal/business data must not automatically become public traceability data.

Public/consumer-facing traceability must use an explicit safe projection of internal data.
