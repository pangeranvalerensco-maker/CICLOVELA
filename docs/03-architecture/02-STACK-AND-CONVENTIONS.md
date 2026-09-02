# Stack & Konvensi Pengkodean

## Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Bean Validation
- Driver PostgreSQL
- OpenAPI/Swagger

## Frontend

- React
- TypeScript
- Client-side routing
- Lapisan API client
- Validasi form
- Notifikasi toast
- Tata letak responsif

## Konvensi API

Gunakan endpoint REST yang berorientasi pada sumber daya (resource).

Contoh:

```text
GET    /api/products
POST   /api/products
GET    /api/products/{id}
PUT    /api/products/{id}
PATCH  /api/products/{id}
DELETE /api/products/{id}
```

## Penamaan

Kelas Java pada backend menggunakan PascalCase. Tabel/kolom database menggunakan snake_case. Penamaan JSON API harus konsisten di seluruh proyek.

## Dilarang Ada Kode Tersembunyi (No Hidden Magic)

Kode yang dihasilkan AI harus dapat dipahami dan didokumentasikan jika logika bisnisnya kompleks. Hindari abstraksi yang tidak perlu, yang menambah kerumitan tanpa memberikan manfaat pada domain.
