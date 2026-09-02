# Desain Database CICLOVELA

## Database

CICLOVELA menggunakan PostgreSQL sebagai database relasional.

Database digunakan untuk menyimpan data dan menjaga integritas data melalui:

- Primary Key
- Foreign Key
- Unique Constraint
- NOT NULL
- CHECK Constraint
- Index
- Transaction

Logika bisnis utama dikelola oleh aplikasi Spring Boot.

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
- tidak mengikat skema PostgreSQL terhadap perubahan aturan bisnis
- tetap memberikan keamanan tipe (type safety) pada Java
- lebih mudah dipahami ketika database diperiksa

## Tanggung Jawab Database

Database bertanggung jawab terhadap:

- penyimpanan data
- hubungan antar entitas
- integritas referensi
- keunikan (uniqueness)
- field yang diwajibkan (required fields)
- validasi dasar
- konsistensi kuantitas
- integritas pergerakan inventaris (inventory movement integrity)

## Tanggung Jawab Aplikasi

Spring Boot bertanggung jawab terhadap:

- autentikasi
- otorisasi
- pengecekan peran (role checking)
- persetujuan entitas bisnis (business entity approval)
- alur kerja transaksi (transaction workflow)
- logika bisnis inventaris
- pemrosesan limbah (waste processing)
- alur kerja pengiriman (delivery workflow)
- alur kerja pembayaran (payment workflow)
- validasi bisnis