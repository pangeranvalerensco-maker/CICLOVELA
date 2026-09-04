import { useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2, AlertCircle } from 'lucide-react';
import { wasteApi } from '../../api/endpoints';

const Waste = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    inventoryId: '',
    quantity: '',
    reason: 'EXPIRED',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        inventoryId: formData.inventoryId,
        quantity: parseFloat(formData.quantity),
        reason: formData.reason,
        notes: formData.notes
      };

      await wasteApi.create(payload);
      toast.success('Pencatatan limbah berhasil, stok telah dikurangi');
      setFormData({ inventoryId: '', quantity: '', reason: 'EXPIRED', notes: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan saat mencatat limbah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Trash2 size={24} className="text-rose-600" />
          Pencatatan Limbah (Waste)
        </h1>
        <p className="text-slate-500 text-sm mt-1">Catat barang yang rusak, kedaluwarsa, atau hilang. Ini akan mengurangi stok gudang secara permanen.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-rose-50 border-b border-rose-100 flex gap-3 items-start">
          <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-rose-800">
            <strong>Perhatian:</strong> Tindakan ini tidak dapat dibatalkan. Pastikan Anda memasukkan UUID Inventory yang benar dan mengecek ulang jumlah barang yang akan dibuang.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ID Inventaris (Inventory UUID) *</label>
            <input 
              type="text" 
              required 
              value={formData.inventoryId} 
              onChange={e => setFormData({...formData, inventoryId: e.target.value})} 
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono" 
              placeholder="Masukkan UUID dari menu Gudang Inventaris" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kuantitas Dibuang *</label>
              <input 
                type="number" 
                step="0.001" 
                min="0.001" 
                required 
                value={formData.quantity} 
                onChange={e => setFormData({...formData, quantity: e.target.value})} 
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
                placeholder="Misal: 5.5" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Alasan *</label>
              <select 
                required 
                value={formData.reason} 
                onChange={e => setFormData({...formData, reason: e.target.value})} 
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-slate-50"
              >
                <option value="EXPIRED">Kedaluwarsa (Expired)</option>
                <option value="SPOILED">Membusuk (Spoiled)</option>
                <option value="DAMAGED">Rusak (Damaged)</option>
                <option value="QUALITY_FAILURE">Gagal Uji Kualitas</option>
                <option value="UNSOLD">Tidak Terjual (Unsold)</option>
                <option value="OTHER">Lainnya</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Catatan Tambahan</label>
            <textarea 
              rows={3} 
              value={formData.notes} 
              onChange={e => setFormData({...formData, notes: e.target.value})} 
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
              placeholder="Jelaskan detail kerusakan atau alasan pembuangan..." 
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-sm shadow-rose-500/30 disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Catat Sebagai Limbah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Waste;
