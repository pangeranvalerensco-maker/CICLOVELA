# Persyaratan Frontend

## Wajib Dari Aturan Proyek

- Tata letak responsif untuk ponsel, tablet, desktop.
- Alur autentikasi lengkap: Login, Register, Logout, Forgot Password, Reset Password.
- JWT disimpan menggunakan Local Storage atau Cookie sesuai spesifikasi proyek.
- Rute privat (private routes).
- Rute peran (role routes).
- Pengalihan (redirect) pada akses yang tidak diotorisasi.
- Dasbor dengan data dari backend, bukan data palsu yang statis.
- Antarmuka CRUD untuk entitas utama.
- Pencarian, penyaringan, pengurutan.
- Paginasi.
- Unggah gambar/PDF.
- Validasi form real-time/sisi klien.
- Notifikasi toast untuk proses CRUD.
- Halaman 401, 403, 404, 500 dan fallback API.

## Layar Inti

### Publik (Public)

- Beranda (Landing/home)
- Login
- Daftar (Register)
- Lupa kata sandi (Forgot password)
- Atur ulang kata sandi (Reset password)
- Halaman produk/keterlacakan publik jika P2 diimplementasikan

### Admin Platform (Platform Admin)

- Dasbor
- Permintaan Business Entity
- Manajemen Business Entity
- Pengguna/anggota
- Data referensi

### Petani (Farmer)

- Dasbor
- Produk (Products)
- Batch
- Inventaris (Inventory)
- Transaksi pasokan (Supply transactions)
- Limbah (Waste)
- Keterlacakan (Traceability)

### Distributor

- Dasbor
- Pasokan masuk (Incoming supply)
- Inventaris (Inventory)
- Transfer/penjualan
- Limbah (Waste)
- Keterlacakan batch (Batch traceability)

### Pengecer (Retailer)

- Dasbor
- Pasokan masuk (Incoming supply)
- Inventaris (Inventory)
- Pesanan/penjualan (Orders/sales)
- Limbah (Waste)
- Keterlacakan (Traceability)

### Konsumen (Consumer)

- Katalog produk
- Detail produk
- Keranjang/pesanan (Cart/order) jika diimplementasikan
- Pesanan (Orders)
- Keterlacakan (Traceability)
