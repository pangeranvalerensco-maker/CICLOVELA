# Keamanan & Penanganan Kesalahan

## Autentikasi

Autentikasi JWT adalah mekanisme yang direncanakan.

## Otorisasi

Semua operasi sensitif harus diotorisasi di sisi server (server-side). Pengecekan peran di sisi klien hanyalah sebuah lapisan UX dan tidak pernah menjadi batas keamanan.

## Kata Sandi

Kata sandi harus di-hash (hashed). Kata sandi dalam teks biasa tidak boleh disimpan.

## Validasi

Semua endpoint POST dan PUT memerlukan validasi di sisi server. Endpoint PATCH juga harus memvalidasi field yang disertakan.

Contoh validasi:

- wajib (required);
- unik (unique);
- min/max;
- enum;
- numerik;
- tanggal (date);
- email.

## Unggah File

Hanya tipe gambar/PDF yang diizinkan yang boleh diproses. Batas ukuran file dan nama file yang aman harus ditentukan.

## Penanganan Kesalahan Global

Tangani:

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 422 Validation Error
- 500 Internal Server Error

Frontend harus menyediakan UI fallback ketika API tidak tersedia.

## CORS

Konfigurasikan CORS untuk asal frontend yang di-deploy (deployed frontend origin) dan bukan mengizinkan asal (origin) sembarangan di produksi.
