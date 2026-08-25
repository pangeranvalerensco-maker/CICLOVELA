# Stack & Coding Conventions

## Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Bean Validation
- PostgreSQL driver
- OpenAPI/Swagger

## Frontend

- React
- TypeScript
- Client-side routing
- API client layer
- Form validation
- Toast notifications
- Responsive layout

## API Convention

Use resource-oriented REST endpoints.

Example:

```text
GET    /api/products
POST   /api/products
GET    /api/products/{id}
PUT    /api/products/{id}
PATCH  /api/products/{id}
DELETE /api/products/{id}
```

## Naming

Backend Java classes use PascalCase. Database tables/columns use snake_case. API JSON naming must be consistent across the project.

## No Hidden Magic

AI-generated code must be understandable and documented when business logic is non-trivial. Avoid unnecessary abstractions that add complexity without helping the domain.
