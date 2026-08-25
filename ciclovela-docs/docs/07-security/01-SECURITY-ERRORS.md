# Security & Error Handling

## Authentication

JWT authentication is the planned mechanism.

## Authorization

All sensitive operations must be authorized server-side. Client-side role checks are only a UX layer and are never the security boundary.

## Passwords

Passwords must be hashed. Plain-text passwords must never be stored.

## Validation

All POST and PUT endpoints require server-side validation. PATCH endpoints must also validate fields that are supplied.

Validation examples:

- required;
- unique;
- min/max;
- enum;
- numeric;
- date;
- email.

## File Upload

Only accepted image/PDF types should be processed. File size limits and safe filenames must be defined.

## Global Error Handling

Handle:

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 422 Validation Error
- 500 Internal Server Error

Frontend must provide fallback UI when the API is unavailable.

## CORS

Configure CORS for the deployed frontend origin rather than allowing arbitrary origins in production.
