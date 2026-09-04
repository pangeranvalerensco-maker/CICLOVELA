import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Package, Plus, Pencil, Trash2 } from 'lucide-react';
import { productApi, categoryApi } from '../../api/endpoints';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';

const Products = () => {
  const { user } = useAuth();
  const isAdminOrFarmer = user?.role === 'PLATFORM_ADMIN' || user?.role === 'FARMER';
  
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', sku: '', description: '', unit: 'KG', shelfLifeDays: '', categoryId: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await productApi.getAll({ page, size: 10, search });
      setData(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
      setTotalElements(res.data.data.totalElements);
    } catch (err) {
      toast.error('Gagal mengambil data produk');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAll({ size: 100 });
      setCategories(res.data.data.content);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search]);

  useEffect(() => {
    if (isAdminOrFarmer) fetchCategories();
  }, [isAdminOrFarmer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        shelfLifeDays: formData.shelfLifeDays ? parseInt(formData.shelfLifeDays) : null
      };

      if (editingId) {
        await productApi.update(editingId, payload);
        toast.success('Produk berhasil diperbarui');
      } else {
        await productApi.create(payload);
        toast.success('Produk berhasil ditambahkan');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      await productApi.delete(id);
      toast.success('Produk dihapus');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menghapus');
    }
  };

  const openModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name, sku: item.sku || '', description: item.description || '', 
        unit: item.unit, shelfLifeDays: item.shelfLifeDays?.toString() || '', 
        categoryId: item.category.id
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', sku: '', description: '', unit: 'KG', shelfLifeDays: '', categoryId: categories[0]?.id || '' });
    }
    setIsModalOpen(true);
  };

  const columns = [
    { key: 'sku', label: 'SKU', render: (item: any) => <span className="font-mono text-slate-500">{item.sku || '-'}</span> },
    { key: 'name', label: 'Nama Produk', render: (item: any) => <span className="font-semibold text-slate-800">{item.name}</span> },
    { key: 'category', label: 'Kategori', render: (item: any) => <span className="px-2 py-1 bg-slate-100 rounded text-xs">{item.category?.name}</span> },
    { key: 'unit', label: 'Satuan', render: (item: any) => <span className="text-slate-600">{item.unit}</span> },
    { key: 'shelfLifeDays', label: 'Umur Simpan', render: (item: any) => <span className="text-slate-600">{item.shelfLifeDays ? `${item.shelfLifeDays} Hari` : '-'}</span> },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package size={24} className="text-emerald-600" />
            Katalog Produk
          </h1>
          <p className="text-slate-500 text-sm mt-1">Kelola master data produk pertanian.</p>
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
        searchPlaceholder="Cari nama / SKU..."
        headerActions={
          isAdminOrFarmer && (
            <button onClick={() => openModal()} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm shadow-emerald-500/30">
              <Plus size={16} /> Tambah Produk
            </button>
          )
        }
        actions={isAdminOrFarmer ? (item: any) => (
          <div className="flex justify-end gap-2">
            <button onClick={() => openModal(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
              <Pencil size={16} />
            </button>
            {user?.role === 'PLATFORM_ADMIN' && (
              <button onClick={() => handleDelete(item.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ) : undefined}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Produk' : 'Tambah Produk Baru'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Produk *</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="Contoh: Tomat Cherry" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SKU (Opsional)</label>
              <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono" placeholder="TOM-CHE-01" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kategori *</label>
              <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                <option value="">Pilih Kategori</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Satuan *</label>
              <select required value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                <option value="KG">Kilogram (KG)</option>
                <option value="GRAM">Gram</option>
                <option value="LITER">Liter</option>
                <option value="UNIT">Satuan (Unit)</option>
                <option value="BOX">Kardus (Box)</option>
                <option value="BUNCH">Ikat (Bunch)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Umur Simpan (Hari)</label>
              <input type="number" min="0" value={formData.shelfLifeDays} onChange={e => setFormData({...formData, shelfLifeDays: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="Contoh: 7" />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
              <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="Deskripsi opsional..." />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Batal</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">Simpan Produk</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
