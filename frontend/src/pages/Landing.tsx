import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Tractor, ArrowRight, ShieldCheck, MapPin, Leaf, 
  ChevronDown, Menu, X, CheckCircle2, TrendingUp, Users
} from 'lucide-react';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Apa itu CICLOVELA?",
      a: "CICLOVELA adalah platform rantai pasok agrikultur B2B dan B2C yang memungkinkan Anda melacak perjalanan produk dari petani, distributor, hingga ke tangan Anda."
    },
    {
      q: "Siapa saja yang bisa menggunakan platform ini?",
      a: "Sistem kami dirancang untuk Petani (Farmer), Perusahaan Distributor, Toko Retailer, hingga Konsumen akhir yang ingin mengecek keaslian dan kesegaran produk."
    },
    {
      q: "Bagaimana cara kerja Lacak Produk (Traceability)?",
      a: "Setiap hasil panen akan mendapatkan ID Batch unik. Anda cukup memasukkan ID tersebut di halaman Lacak Produk, dan sistem akan menampilkan rentetan perpindahan barang yang tidak dapat dimanipulasi (immutable)."
    },
    {
      q: "Apakah fitur ini berbayar?",
      a: "Untuk saat ini, penggunaan fitur dasar (P0) sepenuhnya gratis dalam rangka digitalisasi pertanian Indonesia."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans scroll-smooth">
      
      {/* 1. HEADER & NAVBAR */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Tractor className="text-white" size={24} />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">CICLOVELA</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Tentang Kami</a>
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Fitur</a>
            <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Cara Kerja</a>
            <a href="#faq" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">FAQ</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/traceability" className="text-sm font-bold text-slate-700 hover:text-emerald-600 transition-colors">
              Lacak Produk
            </Link>
            <div className="w-px h-6 bg-slate-200"></div>
            <Link to="/login" className="text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors">
              Masuk
            </Link>
            <Link to="/register" className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md transition-all hover:-translate-y-0.5">
              Daftar Gratis
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4 shadow-lg absolute w-full left-0">
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium text-slate-700">Tentang Kami</a>
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium text-slate-700">Fitur</a>
            <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium text-slate-700">Cara Kerja</a>
            <a href="#faq" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium text-slate-700">FAQ</a>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link to="/traceability" className="w-full text-center py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg">Lacak Produk</Link>
              <Link to="/login" className="w-full text-center py-2.5 bg-emerald-50 text-emerald-700 font-bold rounded-lg">Masuk</Link>
              <Link to="/register" className="w-full text-center py-2.5 bg-slate-900 text-white font-bold rounded-lg">Daftar Gratis</Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        
        {/* 2. HERO SECTION */}
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-br from-emerald-100/40 to-teal-50/10 blur-3xl -z-10 rounded-full" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold mb-8 animate-in slide-in-from-bottom-4 duration-700 fade-in">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistem Rantai Pasok Agrikultur Terpercaya
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto animate-in slide-in-from-bottom-6 duration-700 fade-in delay-100">
              Pantau Hasil Tani Anda dari <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Ladang ke Meja</span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-6 duration-700 fade-in delay-200">
              CICLOVELA memastikan transparansi, integritas harga, dan pencatatan inventaris produk pertanian tidak pernah terputus. Lacak kualitas makanan Anda hari ini.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in slide-in-from-bottom-8 duration-700 fade-in delay-300">
              <Link to="/register" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full text-base font-bold shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-1">
                Mulai Digitalisasi <ArrowRight size={20} />
              </Link>
              <Link to="/traceability" className="w-full sm:w-auto bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-full text-base font-bold transition-all flex items-center justify-center gap-2 hover:-translate-y-1">
                <MapPin size={20} className="text-emerald-500" /> Coba Demo Lacak
              </Link>
            </div>
          </div>
        </section>

        {/* 3. TENTANG KAMI (ABOUT) */}
        <section id="about" className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">Misi Kami untuk Pertanian Nusantara</h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  Seringkali rantai pasok pertanian terlalu panjang dan tidak transparan. Harga melonjak drastis di tingkat konsumen, sementara petani mendapat untung minim. Selain itu, tidak ada yang tahu kapan sebuah tomat benar-benar dipanen.
                </p>
                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                  <strong>CICLOVELA</strong> lahir untuk memutus rantai ketidaktahuan ini. Dengan sistem *batch-based inventory* dan *immutable ledger*, setiap perpindahan tangan dari petani, distributor, hingga toko tercatat abadi.
                </p>
                <div className="grid grid-cols-2 gap-6 border-t border-slate-800 pt-8">
                  <div>
                    <h4 className="text-4xl font-black text-emerald-400 mb-1">100%</h4>
                    <p className="text-slate-400 text-sm font-medium">Transparansi Data</p>
                  </div>
                  <div>
                    <h4 className="text-4xl font-black text-teal-400 mb-1">0%</h4>
                    <p className="text-slate-400 text-sm font-medium">Manipulasi Stok</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-3xl transform rotate-3 scale-105 blur-lg"></div>
                <div className="bg-slate-800 p-8 rounded-3xl relative border border-slate-700 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center"><CheckCircle2 size={24}/></div>
                    <div>
                      <h4 className="font-bold text-lg">Integritas Terjaga</h4>
                      <p className="text-slate-400 text-sm">Setiap transaksi dikunci sistem</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center"><Users size={24}/></div>
                    <div>
                      <h4 className="font-bold text-lg">Verifikasi Entitas</h4>
                      <p className="text-slate-400 text-sm">Distributor terverifikasi legal</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center"><TrendingUp size={24}/></div>
                    <div>
                      <h4 className="font-bold text-lg">Pencegahan Limbah</h4>
                      <p className="text-slate-400 text-sm">Peringatan masa simpan (Shelf-life)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CARA KERJA (HOW IT WORKS) */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Bagaimana Ciclovela Bekerja?</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-16">Alur kerja transparan yang menjamin integritas setiap komoditas pertanian.</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Garis penghubung (Desktop) */}
              <div className="hidden md:block absolute top-12 left-1/8 right-1/8 h-0.5 bg-slate-100 z-0 w-3/4 mx-auto"></div>

              {[
                { step: 1, title: 'Petani Panen', desc: 'Petani mendaftarkan batch produk lengkap dengan tanggal kedaluwarsa.' },
                { step: 2, title: 'Distribusi', desc: 'Distributor resmi membeli dan mencatat pergerakan barang (Inbound).' },
                { step: 3, title: 'Retail', desc: 'Retailer membeli stok, mencatat pembuangan limbah (jika ada).' },
                { step: 4, title: 'Konsumen Lacak', desc: 'Pembeli mengecek riwayat barang via kode untuk memastikan keaslian.' }
              ].map((item) => (
                <div key={item.step} className="relative z-10 bg-white pt-6">
                  <div className="w-16 h-16 bg-emerald-600 text-white text-2xl font-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-600/30 border-4 border-white">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. FITUR UTAMA (FEATURES) */}
        <section id="features" className="bg-slate-50 py-24 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Fitur Unggulan</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 border border-blue-100">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Immutable Ledger</h3>
                <p className="text-slate-600 leading-relaxed text-sm">Semua data transaksi dan pergerakan stok bersifat permanen dan tidak bisa dimanipulasi setelah dikonfirmasi.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow transform md:-translate-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 border border-emerald-100">
                  <MapPin size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Traceability Publik</h3>
                <p className="text-slate-600 leading-relaxed text-sm">Fitur pelacakan riwayat (Traceability) yang aman, hanya menampilkan data perjalanan publik tanpa membocorkan margin harga.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-6 border border-rose-100">
                  <Leaf size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Manajemen Limbah</h3>
                <p className="text-slate-600 leading-relaxed text-sm">Fitur pencatatan produk kedaluwarsa atau rusak (Waste) yang terhubung langsung dengan pemotongan stok inventaris otomatis.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FAQ SECTION */}
        <section id="faq" className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900">Pertanyaan Sering Ditanya (FAQ)</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-slate-200 rounded-xl overflow-hidden transition-all">
                  <button 
                    className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  >
                    <span className="font-bold text-slate-800 text-left">{faq.q}</span>
                    <ChevronDown size={20} className={`text-slate-500 transition-transform ${activeFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  {activeFaq === index && (
                    <div className="px-6 py-4 bg-white">
                      <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* 7. FOOTER */}
      <footer className="bg-slate-950 pt-16 pb-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Tractor className="text-emerald-500" size={28} />
                <span className="text-2xl font-black tracking-tight text-white">CICLOVELA</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                Sistem Perekaman Siklus Rantai Pasok Pertanian Berbasis Batch. Membawa kepercayaan kembali ke meja makan Anda.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Pintasan</h4>
              <ul className="space-y-3">
                <li><Link to="/traceability" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Lacak Produk</Link></li>
                <li><Link to="/login" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Masuk B2B</Link></li>
                <li><Link to="/register" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Daftar Akun Baru</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Legal & Bantuan</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Syarat & Ketentuan</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Hubungi Kami</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              &copy; 2026 CICLOVELA Platform. Memenuhi Tugas Akhir S1.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              Dibuat dengan <Leaf size={14} className="text-emerald-500" /> di Indonesia
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
