# Alur Kerja GitHub (GitHub Workflow)

## Repositori

Proyek ini harus menggunakan satu repositori GitHub publik yang berisi frontend dan backend karena aturan proyek secara eksplisit mewajibkan monorepo publik.

## Cabang (Branches)

Rekomendasi:

```text
main       = stabil/demo
 develop   = integrasi
 feature/* = pekerjaan individual
```

Untuk proyek solo, pertahankan alur kerja yang ringan. Jangan membuat birokrasi cabang hanya agar terlihat seperti perusahaan beranggotakan 400 orang.

## Konvensi Komit (Commit Convention)

Gunakan pesan komit yang dapat dibaca manusia:

```text
feat: add batch management
fix: prevent negative inventory
refactor: simplify inventory service
docs: update business rules
chore: configure swagger
```

## Kebijakan Kontribusi AI

Agen AI adalah alat, bukan pembuat proyek (project authors). Pengembang manusia tetap bertanggung jawab atas arsitektur, persyaratan, peninjauan, pengujian, dan komit akhir.

Kode yang dihasilkan AI harus ditinjau sebelum digabungkan (merge).

Jangan membuat komit palsu, identitas penulis palsu (fake authorship), atau riwayat kontribusi yang menyesatkan. Tujuannya adalah proyek rekayasa perangkat lunak yang sesungguhnya, bukan rekonstruksi arkeologis tentang siapa yang mengetik setiap titik koma.

## Aturan Push Harian

Setidaknya satu push bermakna per sesi kerja/hari.

Setiap push harus mewakili keadaan yang koheren, idealnya:

1. perubahan persyaratan/domain;
2. implementasi backend;
3. implementasi frontend;
4. pengujian/perbaikan (tests/fixes);
5. dokumentasi.
