# API Contract Plan

## Mandatory HTTP Methods

The project specification requires REST support for GET, POST, PUT, PATCH, and DELETE.

## Response Shape

The API must use a consistent JSON response strategy.

Recommended success shape:

```json
{
  "success": true,
  "message": "...",
  "data": {},
  "meta": {}
}
```

Recommended error shape:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ],
  "timestamp": "..."
}
```

The exact shape must be fixed before frontend integration.

## Endpoint Families

```text
/auth
/users
/business-entities
/memberships
/products
/categories
/batches
/inventories
/inventory-movements
/supply-transactions
/orders
/waste-records
/traceability
/attachments
```

## List Query Requirements

List endpoints must support, where applicable:

- search;
- filters;
- sorting;
- pagination.

Example:

```text
GET /api/products?page=1&limit=10&search=tomato&category=vegetable&sort=name,asc
```

## Status Codes

At minimum handle:

- 200 OK
- 201 Created
- 204 No Content where appropriate
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 422 Validation Error
- 500 Internal Server Error

## API Documentation

Use Swagger/OpenAPI and ensure all endpoints are testable through the generated documentation.
