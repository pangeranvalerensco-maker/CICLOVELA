# CICLOVELA Database Design

## Database

CICLOVELA menggunakan PostgreSQL sebagai relational database.

Database digunakan untuk menyimpan data dan menjaga integritas data melalui:

- Primary Key
- Foreign Key
- Unique Constraint
- NOT NULL
- CHECK Constraint
- Index
- Transaction

Business logic utama dikelola oleh aplikasi Spring Boot.

## Identifier

Semua primary key utama menggunakan UUID.

## Application Enum

CICLOVELA tidak menggunakan PostgreSQL Native ENUM.

Nilai seperti role, status, type, dan category yang memiliki pilihan terbatas disimpan sebagai VARCHAR di database dan direpresentasikan sebagai Java Enum di application layer.

Contoh:

Database:

role VARCHAR(30)

Java:

public enum UserRole {
    PLATFORM_ADMIN,
    FARMER,
    CONSUMER
}

Alasan:

- lebih mudah dikembangkan
- lebih mudah dimigrasikan
- tidak mengikat schema PostgreSQL terhadap perubahan business rule
- tetap memberikan type safety pada Java
- lebih mudah dipahami ketika database diperiksa

## Database Responsibility

Database bertanggung jawab terhadap:

- penyimpanan data
- hubungan antar entity
- integritas referensi
- uniqueness
- required fields
- validasi dasar
- konsistensi quantity
- inventory movement integrity

## Application Responsibility

Spring Boot bertanggung jawab terhadap:

- authentication
- authorization
- role checking
- business entity approval
- transaction workflow
- inventory business logic
- waste processing
- delivery workflow
- payment workflow
- business validation