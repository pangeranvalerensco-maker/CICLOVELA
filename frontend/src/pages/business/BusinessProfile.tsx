import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Building2 } from 'lucide-react';
import { businessApi } from '../../api/endpoints';
import FileUpload from '../../components/ui/FileUpload';

const BusinessProfile = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', businessType: 'DISTRIBUTOR', legalName: '', description: '',
    phone: '', email: '', address: '', city: '', province: '', postalCode: '',
    verificationDocumentUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await businessApi.createRequest(formData);
      toast.success('Pendaftaran entitas bisnis berhasil dikirim untuk ditinjau!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan saat mendaftar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Building2 size={24} className="text-emerald-600" />
          Pendaftaran Entitas Bisnis
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Daftarkan organisasi Anda (Distributor/Retailer) agar dapat melakukan transaksi rantai pasok secara resmi.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Section 1: Info Dasar */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Informasi Dasar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Bisnis (Brand) *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="Contoh: PT Makmur Jaya" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Legal / PT (Opsional)</label>
                <input type="text" value={formData.legalName} onChange={e => setFormData({...formData, legalName: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Peran Bisnis *</label>
                <select required value={formData.businessType} onChange={e => setFormData({...formData, businessType: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-slate-50">
                  <option value="DISTRIBUTOR">Distributor (Beli dari Petani)</option>
                  <option value="RETAILER">Retailer (Jual ke Konsumen)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
              </div>
            </div>
          </div>

          {/* Section 2: Kontak & Alamat */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Kontak & Lokasi Operasional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Resmi *</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Telepon</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap Gudang/Kantor *</label>
                <textarea required rows={2} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kota/Kabupaten *</label>
                <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Provinsi *</label>
                <input required type="text" value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kode Pos</label>
                <input type="text" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
              </div>
            </div>
          </div>

          {/* Section 3: Upload Dokumen */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Verifikasi Legalitas</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <FileUpload 
                label="Unggah SIUP / NIB / Dokumen Pendirian (PDF/JPG)"
                onUploadSuccess={(url) => setFormData({...formData, verificationDocumentUrl: url})}
              />
            </div>
          </div>

        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button type="submit" disabled={loading} className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm shadow-emerald-500/30 disabled:opacity-50">
            {loading ? 'Mengirim Data...' : 'Ajukan Pendaftaran'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessProfile;
