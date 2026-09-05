import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => (
    <div className="max-w-3xl mx-auto px-4 py-12 w-full flex-1">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800">
        <ArrowLeft size={16} /> Kembali ke Beranda
      </Link>
      <h1 className="text-3xl font-extrabold text-slate-900 mt-6">Hubungi Kami</h1>
      <div className="mt-6 grid gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
          <Mail className="text-emerald-600" /> <div><p className="font-bold text-slate-800 text-sm">Email</p><p className="text-sm text-slate-600">halo@ciclovela.id</p></div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
          <Phone className="text-emerald-600" /> <div><p className="font-bold text-slate-800 text-sm">Telepon / WA</p><p className="text-sm text-slate-600">+62 812-0000-0000 (Senin–Jumat, 09.00–17.00 WIB)</p></div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
          <MapPin className="text-emerald-600" /> <div><p className="font-bold text-slate-800 text-sm">Alamat</p><p className="text-sm text-slate-600">Jl. Tani Makmur No. 1, Indonesia</p></div>
        </div>
      </div>
    </div>
);

export default Contact;
