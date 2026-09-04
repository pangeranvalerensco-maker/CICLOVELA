import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Tractor, Plus, Pencil, Trash2 } from 'lucide-react';
import { batchApi, productApi } from '../../api/endpoints';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';

const Batches = () => {
  const { user } = useAuth();
  const isFarmer = user?.role === 'FARMER';
  
  const [data, setData] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    batchCode: '', productId: '', harvestDate: '', initialQuantity: '', unit: 'KG', qualityGrade: 'A', expiryDate: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await batchApi.getAll({ page, size: 10, search, farmerId: isFarmer ? user?.id : undefined });
      setData(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
      setTotalElements(res.data.data.totalElements);
    } catch (err) {
      toast.error('Gagal mengambil data batch');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await productApi.getAll({ size: 100 });
      setProducts(res.data.data.content);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search]);

  useEffect(() => {
    if (isFarmer) fetchProducts();
  }, [isFarmer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        initialQuantity: parseFloat(formData.initialQuantity)
      };

      if (editingId) {
        await batchApi.update(editingId, payload);
        toast.success('Batch berhasil diperbarui');
      } else {
        await batchApi.create(payload);
        toast.success('Batch baru berhasil didaftarkan');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin membatalkan/menghapus batch ini?')) return;
    try {
      await batchApi.delete(id);
      toast.success('Batch dibatalkan');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal membatalkan');
    }
  };

  const openModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        batchCode: item.batchCode,
        productId: item.productId,
        harvestDate: item.harvestDate,
        initialQuantity: item.initialQuantity.toString(),
        unit: item.unit,
        qualityGrade: item.qualityGrade,
        expiryDate: item.expiryDate
      });
    } else {
      setEditingId(null);
      setFormData({ 
        batchCode: `B-${new Date().getFullYear()}${new Date().getMonth()+1}-${Math.floor(Math.random()*1000)}`, 
        productId: products[0]?.id || '', 
        harvestDate: new Date().toISOString().split('T')[0], 
        initialQuantity: '', unit: 'KG', qualityGrade: 'A', expiryDate: '' 
      });
    }
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'DEPLETED': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'EXPIRED': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const columns = [
    { key: 'batchCode', label: 'Kode Batch', render: (item: any) => <span className="font-bold text-slate-800">{item.batchCode}</span> },
    { key: 'productName', label: 'Produk', render: (item: any) => <span className="text-slate-700">{item.productName}</span> },
    { key: 'harvestDate', label: 'Tgl Panen', render: (item: any) => <span className="text-slate-600">{new Date(item.harvestDate).toLocaleDateString('id-ID')}</span> },
    { key: 'expiryDate', label: 'Kedaluwarsa', render: (item: any) => <span className="text-rose-600 font-medium">{new Date(item.expiryDate).toLocaleDateString('id-ID')}</span> },
    { key: 'initialQuantity', label: 'Qty Awal', render: (item: any) => <span className="font-semibold text-slate-700">{item.initialQuantity} {item.unit}</span> },
    { key: 'qualityGrade', label: 'Kualitas', render: (item: any) => <span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-xs font-bold">Grade {item.qualityGrade}</span> },
    { key: 'status', label: 'Status', render: (item: any) => <span className={`px-2 py-1 border rounded text-xs font-bold ${getStatusColor(item.status)}`}>{item.status}</span> },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Tractor size={24} className="text-emerald-600" />
            Batch Panen
          </h1>
          <p className="text-slate-500 text-sm mt-1">Kelola data batch produksi / panen Anda.</p>
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
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari kode batch..."
        headerActions={
          isFarmer && (
            <button onClick={() => openModal()} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm shadow-emerald-500/30">
              <Plus size={16} /> Daftarkan Batch
            </button>
          )
        }
        actions={isFarmer ? (item: any) => (
          <div className="flex justify-end gap-2">
            <button onClick={() => openModal(item)} disabled={item.status !== 'ACTIVE'} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-30" title="Edit">
              <Pencil size={16} />
            </button>
            <button onClick={() => handleDelete(item.id)} disabled={item.status !== 'ACTIVE'} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30" title="Batalkan">
              <Trash2 size={16} />
            </button>
          </div>
        ) : undefined}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Batch' : 'Daftar Batch Panen Baru'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Produk *</label>
              <select required value={formData.productId} onChange={e => setFormData({...formData, productId: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                <option value="">Pilih Produk</option>
                {products.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kode Batch *</label>
              <input type="text" required value={formData.batchCode} onChange={e => setFormData({...formData, batchCode: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono font-bold text-emerald-700" placeholder="KODE-BATCH" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Panen *</label>
              <input type="date" required value={formData.harvestDate} onChange={e => setFormData({...formData, harvestDate: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Kedaluwarsa *</label>
              <input type="date" required value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-rose-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kuantitas Awal *</label>
              <div className="flex gap-2">
                <input type="number" step="0.001" min="0.001" required value={formData.initialQuantity} onChange={e => setFormData({...formData, initialQuantity: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="Contoh: 100.5" />
                <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-24 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-slate-50">
                  <option value="KG">KG</option>
                  <option value="GRAM">Gram</option>
                  <option value="LITER">Liter</option>
                  <option value="UNIT">Unit</option>
                  <option value="BOX">Box</option>
                  <option value="BUNCH">Ikat</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kualitas (Grade) *</label>
              <select required value={formData.qualityGrade} onChange={e => setFormData({...formData, qualityGrade: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                <option value="A">Grade A (Terbaik)</option>
                <option value="B">Grade B (Standar)</option>
                <option value="C">Grade C (Kurang)</option>
                <option value="REJECTED">Ditolak (Rejected)</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Batal</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">Simpan Batch</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Batches;
