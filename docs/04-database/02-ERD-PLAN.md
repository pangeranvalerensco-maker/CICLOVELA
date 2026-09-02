# Perencanaan ERD

## Persyaratan Demonstrasi Relasi

### One-to-One

Kandidat:

```text
User 1──1 FarmerProfile
```

### One-to-Many

```text
Product 1──N Batch
```

### Many-to-One

Setiap Batch merupakan milik satu Product sedangkan sebuah Product dapat memiliki banyak Batch.

### Many-to-Many

Rekomendasi:

```text
User N──N BusinessEntity
```

diselesaikan melalui `memberships`.

## Batasan Penting

Jangan membuat relasi buatan yang hanya bertujuan untuk memenuhi tugas. Setiap relasi harus berkorespondensi dengan konsep bisnis yang nyata.

## Daftar Periksa Finalisasi ERD

- [ ] Setiap FK memiliki makna kepemilikan yang jelas.
- [ ] Tidak ada kelompok data yang berulang (repeating groups).
- [ ] Tidak ada atribut duplikat yang tidak diperlukan.
- [ ] 3NF dipertimbangkan.
- [ ] Strategi timestamp konsisten.
- [ ] Strategi soft delete konsisten.
- [ ] Kendala unik (unique constraints) ditentukan.
- [ ] Indeks ditentukan untuk bidang pencarian/filter umum.
- [ ] Kendala konsistensi inventory ditentukan.
- [ ] Batasan transaksional diidentifikasi.
