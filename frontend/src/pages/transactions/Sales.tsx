import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Store, Plus, Check } from 'lucide-react';
import { saleApi } from '../../api/endpoints';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';

const Sales = () => {
  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    sellerEntityId: '', buyerEntityId: '', buyerUserId: '', notes: '', batchId: '', quantity: '', unitPrice: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await saleApi.getAll({ page, size: 10 });
      setData(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
      setTotalElements(res.data.data.totalElements);
    } catch (err) {
      toast.error('Gagal mengambil data penjualan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        sellerEntityId: formData.sellerEntityId,
        buyerEntityId: formData.buyerEntityId || null,
        buyerUserId: formData.buyerUserId || null,
        notes: formData.notes,
        items: [{
          batchId: formData.batchId,
          quantity: parseFloat(formData.quantity),
          unitPrice: parseFloat(formData.unitPrice)
        }]
      };

      await saleApi.create(payload);
      toast.success('Penjualan baru berhasil dibuat');
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await saleApi.updateStatus(id, status);
      toast.success(`Status berhasil diubah menjadi ${status}`);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengubah status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const columns = [
    { key: 'transactionCode', label: 'Kode Transaksi', render: (item: any) => <span className="font-bold text-slate-800">{item.transactionCode}</span> },
    { key: 'transactionDate', label: 'Tanggal', render: (item: any) => <span className="text-slate-600">{new Date(item.transactionDate).toLocaleDateString('id-ID')}</span> },
    { key: 'totalAmount', label: 'Total Penjualan', render: (item: any) => <span className="font-semibold text-slate-700">Rp {item.totalAmount.toLocaleString('id-ID')}</span> },
    { key: 'status', label: 'Status', render: (item: any) => <span className={`px-2 py-1 border rounded text-xs font-bold ${getStatusColor(item.status)}`}>{item.status}</span> },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Store size={24} className="text-emerald-600" />
            Transaksi Outbound (Penjualan)
          </h1>
          <p className="text-slate-500 text-sm mt-1">Penjualan produk ke Retailer lain atau ke Konsumen akhir.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setPage}
        headerActions={
          <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm shadow-emerald-500/30">
            <Plus size={16} /> Buat Penjualan
          </button>
        }
        actions={(item: any) => (
          <div className="flex justify-end gap-2">
            {item.status === 'PENDING' && (
              <button onClick={() => handleUpdateStatus(item.id, 'CONFIRMED')} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Konfirmasi">
                <Check size={16} />
              </button>
            )}
            {item.status === 'CONFIRMED' && (
              <button onClick={() => handleUpdateStatus(item.id, 'COMPLETED')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Selesaikan & Kurangi Stok">
                <Check size={16} />
              </button>
            )}
          </div>
        )}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Buat Transaksi Penjualan" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg mb-4 text-sm text-blue-800 border border-blue-200">
            <strong>Mode MVP:</strong> Masukkan UUID Anda sebagai Penjual, dan pilih salah satu: EntityID Pembeli (B2B) atau UserID Pembeli (B2C).
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">ID Entitas Penjual (Anda)*</label>
              <input type="text" required value={formData.sellerEntityId} onChange={e => setFormData({...formData, sellerEntityId: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono" placeholder="UUID Entitas Anda" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ID Entitas Pembeli (Retailer)</label>
              <input type="text" value={formData.buyerEntityId} onChange={e => setFormData({...formData, buyerEntityId: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono" placeholder="Kosongkan jika B2C" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Atau ID User Pembeli (Konsumen)</label>
              <input type="text" value={formData.buyerUserId} onChange={e => setFormData({...formData, buyerUserId: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono" placeholder="Kosongkan jika B2B" />
            </div>

            <div className="col-span-2 border-t border-slate-200 mt-2 pt-4">
              <h4 className="font-semibold text-slate-800 mb-3">Item Penjualan</h4>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">ID Batch Barang *</label>
              <input type="text" required value={formData.batchId} onChange={e => setFormData({...formData, batchId: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono" placeholder="UUID Batch di Gudang Anda" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kuantitas *</label>
              <input type="number" step="0.001" min="0.001" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="Misal: 10.5" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Harga Satuan (Rp) *</label>
              <input type="number" step="0.01" min="0" required value={formData.unitPrice} onChange={e => setFormData({...formData, unitPrice: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="Misal: 25000" />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Catatan</label>
              <textarea rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="Opsional..." />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Batal</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">Buat Penjualan</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Sales;
