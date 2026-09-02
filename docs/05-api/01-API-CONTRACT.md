# Rencana Kontrak API

## Metode HTTP Wajib

Spesifikasi proyek mengharuskan dukungan REST untuk GET, POST, PUT, PATCH, dan DELETE.

## Bentuk Respons

API harus menggunakan strategi respons JSON yang konsisten.

Bentuk sukses yang disarankan:

```json
{
  "success": true,
  "message": "...",
  "data": {},
  "meta": {}
}
```

Bentuk kesalahan yang disarankan:

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

Bentuk yang tepat harus diselesaikan sebelum integrasi frontend.

## Keluarga Endpoint

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

## Persyaratan Kueri Daftar

Endpoint daftar harus mendukung, jika memungkinkan:

- pencarian (search);
- penyaringan (filters);
- pengurutan (sorting);
- paginasi (pagination).

Contoh:

```text
GET /api/products?page=1&limit=10&search=tomato&category=vegetable&sort=name,asc
```

## Kode Status

Minimal menangani:

- 200 OK
- 201 Created
- 204 No Content jika sesuai
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 422 Validation Error
- 500 Internal Server Error

## Dokumentasi API

Gunakan Swagger/OpenAPI dan pastikan semua endpoint dapat diuji melalui dokumentasi yang dihasilkan.
