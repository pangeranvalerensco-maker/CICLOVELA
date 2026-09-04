FRONTEND (Client Side)
1. Responsive untuk semua ukuran layar (mobile, tablet, desktop). 2. Multibahasa (i18n): Misal dukungan Bahasa Indonesia dan Inggris. 3. Upload Gambar/Dokumen
4. Notifikasi / Toast Message (Sukses, gagal, error, loading)
5. Auth Flow :
 Login, Register, Logout
 Menyimpan token (localStorage/cookies)
6. Routing Halaman (SPA atau MPA)
7. Fitur pagination
8. Ada halaman yang menyediakan kalo halaman itu tidak bisa diakses atau tidakada seperti 400, 403 dll
9. Deployed ke platform gratis seperti Vercel, Netlify, GitHub Pages
BACKEND (Server Side)
1. Minimal 2 Role (Role-based Access Control / RBAC). Contoh: admin, user
2. CRUD Lengkap untuk semua entitas
3. Autentikasi & Autorisasi
 JWT Token / OAuth
 Proteksi berdasarkan role
4. Validasi Server-side
5. File Upload Handler. Menerima dan menyimpan file yang diunggah
6. Email Service. Reset password / verifikasi akun
7. Error Handling. Sistem error global (500, 404, 401, dll). DATABASE (Relational atau Non-relational)
1. Minimal 5 Tabel Utama
2. Minimal 4 Relasi antar tabel/koleksi (One to One, One to Many, Many toOnedan Many to Many)
TEMA WEBSITE
1. E-Learning Platform Mini
 Upload materi
 Role: siswa, guru, admin
 Halaman nilai dan tugas
2. Job Board / Portal Loker
 CRUD lowongan
 Upload CV
 Role: pelamar, HRD, admin
3. Event Management System
 CRUD event, daftar peserta
 Upload tiket/event flyer
 Role: peserta, EO, admin
4. Website Donasi / Crowdfunding
 CRUD campaign
 Upload bukti transfer
 Role: donatur, pengelola
5. Sistem Booking Layanan (Service Booking App)
 Booking salon, bengkel, konsultasi
 Upload bukti pembayaran
 Role: pelanggan, penyedia jasa
6. Sistem Lelang Online
 Upload item lelang
 Komentar & bidding
 Role: peserta, pelelang, admin
7. Sistem Manajemen Pajak Pribadi dan UMKM
 Input pendapatan dan beban usaha
 Perhitungan PPh final otomatis
 Reminder jatuh tempo pajak
 Download laporan pajak
 Upload dokumen pajak (NPWP, SPT, dsb.)
 Role: User, Admin
8. Sistem Manajemen Keuangan Pribadi (Personal Finance Tracker)
 Input pemasukan & pengeluaran
 Upload bukti transaksi (struk)
 Laporan bulanan (chart)
 Role: user biasa, auditor, admin
9. Aplikasi Laporan Keuangan UKM (Usaha Kecil Menengah)
 Input transaksi (pemasukan/pengeluaran)
 Klasifikasi akun (aset, liabilitas, ekuitas, pendapatan, beban)
 Laporan: jurnal umum, buku besar, laba rugi, neraca
 Upload bukti transaksi (struk, faktur)
 Admin, User (UKM)
*Catatan: Poin-poin di tiap-tiap tema diatas ialah gambaran kecilnya saja, selebihnyabisa dikembangkan lebih lanjut lagi