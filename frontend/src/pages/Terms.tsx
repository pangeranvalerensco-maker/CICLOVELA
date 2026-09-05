import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms = () => (
    <div className="max-w-3xl mx-auto px-4 py-12 w-full flex-1">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800">
        <ArrowLeft size={16} /> Kembali ke Beranda
      </Link>
      <h1 className="text-3xl font-extrabold text-slate-900 mt-6">Syarat &amp; Ketentuan</h1>
      <div className="mt-6 space-y-4 text-sm text-slate-600 leading-relaxed bg-white border border-slate-200 rounded-2xl p-6">
        <p>1. CICLOVELA adalah platform pencatatan rantai pasok pertanian. Data transaksi yang sudah berstatus selesai bersifat final dan tercatat dalam ledger yang tidak dapat diubah.</p>
        <p>2. Petani bertanggung jawab atas kebenaran data batch (tanggal panen, kuantitas awal, tanggal kedaluwarsa) yang didaftarkan.</p>
        <p>3. Entitas bisnis (Distributor/Retailer) wajib terverifikasi oleh Platform Admin sebelum dapat bertransaksi.</p>
        <p>4. Dilarang memanipulasi data milik pihak lain. Pelanggaran berakibat penangguhan akun.</p>
        <p>5. Fitur pelacakan publik hanya menampilkan data perjalanan yang layak konsumsi publik, tanpa membocorkan margin harga internal.</p>
      </div>
    </div>
);

export default Terms;
