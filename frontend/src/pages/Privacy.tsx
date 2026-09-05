import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => (
    <div className="max-w-3xl mx-auto px-4 py-12 w-full flex-1">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800">
        <ArrowLeft size={16} /> Kembali ke Beranda
      </Link>
      <h1 className="text-3xl font-extrabold text-slate-900 mt-6">Kebijakan Privasi</h1>
      <div className="mt-6 space-y-4 text-sm text-slate-600 leading-relaxed bg-white border border-slate-200 rounded-2xl p-6">
        <p>1. Kami menyimpan nama, email, dan data operasional yang Anda masukkan untuk menjalankan layanan rantai pasok.</p>
        <p>2. Kata sandi disimpan dalam bentuk hash (BCrypt) dan tidak pernah disimpan sebagai teks biasa.</p>
        <p>3. Data harga internal antar pelaku bisnis tidak ditampilkan ke publik. Halaman pelacakan hanya menampilkan asal, tanggal, dan perjalanan batch.</p>
        <p>4. Token autentikasi (JWT) disimpan di perangkat Anda dan kedaluwarsa otomatis. Anda dapat keluar kapan saja untuk menghapusnya.</p>
      </div>
    </div>
);

export default Privacy;
