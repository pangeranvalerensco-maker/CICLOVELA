# ERD Planning

## Required Relationship Demonstration

### One-to-One

Candidate:

```text
User 1──1 FarmerProfile
```

### One-to-Many

```text
Product 1──N Batch
```

### Many-to-One

Every Batch belongs to one Product while a Product can have many Batches.

### Many-to-Many

Recommended:

```text
User N──N BusinessEntity
```

resolved through `memberships`.

## Important Constraint

Do not create artificial relationships solely to satisfy the assignment. Every relationship should correspond to an actual business concept.

## ERD Finalization Checklist

- [ ] Every FK has a clear ownership meaning.
- [ ] No repeating groups.
- [ ] No unnecessary duplicated attributes.
- [ ] 3NF considered.
- [ ] Timestamp strategy consistent.
- [ ] Soft delete strategy consistent.
- [ ] Unique constraints defined.
- [ ] Indexes defined for common search/filter fields.
- [ ] Inventory consistency constraints defined.
- [ ] Transactional boundaries identified.
