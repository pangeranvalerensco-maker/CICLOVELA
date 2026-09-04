import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Layers, Plus, Pencil, Trash2 } from 'lucide-react';
import { categoryApi } from '../../api/endpoints';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';

const Categories = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', status: 'ACTIVE' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.getAll({ page, size: 10 });
      setData(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
      setTotalElements(res.data.data.totalElements);
    } catch (err) {
      toast.error('Gagal mengambil data kategori');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await categoryApi.update(editingId, formData);
        toast.success('Kategori diperbarui');
      } else {
        await categoryApi.create(formData);
        toast.success('Kategori baru ditambahkan');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus kategori ini?')) return;
    try {
      await categoryApi.delete(id);
      toast.success('Kategori dihapus');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menghapus');
    }
  };

  const openModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ name: item.name, description: item.description || '', status: item.status });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', status: 'ACTIVE' });
    }
    setIsModalOpen(true);
  };

  const columns = [
    { key: 'name', label: 'Nama Kategori', render: (item: any) => <span className="font-bold text-slate-800">{item.name}</span> },
    { key: 'description', label: 'Deskripsi', render: (item: any) => <span className="text-slate-600">{item.description || '-'}</span> },
    { key: 'status', label: 'Status', render: (item: any) => (
      <span className={`px-2 py-1 border rounded text-xs font-bold ${item.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-rose-100 text-rose-700 border-rose-200'}`}>
        {item.status}
      </span>
    )}
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Layers size={24} className="text-emerald-600" /> Kategori Produk
          </h1>
          <p className="text-slate-500 text-sm mt-1">Kelola daftar klasifikasi komoditas (Admin Only).</p>
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
          <button onClick={() => openModal()} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm shadow-emerald-500/30">
            <Plus size={16} /> Kategori Baru
          </button>
        }
        actions={(item: any) => (
          <div className="flex justify-end gap-2">
            <button onClick={() => openModal(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={16} /></button>
            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
          </div>
        )}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Kategori" : "Tambah Kategori"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kategori *</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
            <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">Batal</button>
            <button type="submit" className="px-4 py-2 text-sm text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">Simpan</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default Categories;