import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Package, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { productApi, categoryApi } from '../../api/endpoints';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import DetailModal from '../../components/ui/DetailModal';
import FileUpload from '../../components/ui/FileUpload';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { hasMaxLength, hasMinLength, isRequired } from '../../utils/validation';

const Products = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const isAdminOrFarmer = user?.role === 'PLATFORM_ADMIN' || user?.role === 'FARMER';
  
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('name,asc');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', sku: '', description: '', unit: 'KG', shelfLifeDays: '', categoryId: '', imageUrl: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<{ name?: string; sku?: string; shelfLifeDays?: string }>({});

  const fetchData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [sortField, sortDir] = sortBy.split(',');
      const params: any = { page, size: pageSize, search: search || '', sort: `${sortField},${sortDir}` };
      if (filterCategory) params.categoryId = filterCategory;
      const res = await productApi.getAll(params);
      setData(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
      setTotalElements(res.data.data.totalElements);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal mengambil data produk';
      setLoadError(message);
      toast.error(message);
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
  }, [page, pageSize, search, filterCategory, sortBy]);

  useEffect(() => {
    if (isAdminOrFarmer) fetchCategories();
  }, [isAdminOrFarmer]);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { name?: string; sku?: string; shelfLifeDays?: string } = {};
    if (!isRequired(formData.name)) nextErrors.name = t('common.validation_required');
    else if (!hasMinLength(formData.name, 3)) nextErrors.name = t('common.validation_min', { min: 3 });
    else if (!hasMaxLength(formData.name, 150)) nextErrors.name = t('common.validation_max', { max: 150 });
    if (formData.sku && !hasMaxLength(formData.sku, 50)) nextErrors.sku = t('common.validation_max', { max: 50 });
    if (formData.shelfLifeDays && Number(formData.shelfLifeDays) < 0) nextErrors.shelfLifeDays = t('common.validation_positive');
    setFormErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    try {
      const payload: any = {
        ...formData,
        categoryId: formData.categoryId || null,
        ...(isAddingCategory && newCategoryName.trim()
          ? { newCategoryName: newCategoryName.trim() }
          : {}),
        sku: formData.sku?.trim() ? formData.sku.trim() : null,
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
      setNewCategoryName('');
      setIsAddingCategory(false);
      fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Terjadi kesalahan';
      const errors = err.response?.data?.errors;
      if (Array.isArray(errors) && errors.length > 0) {
        toast.error(errors[0].message);
      } else {
        toast.error(msg);
      }
    }
  };

  const executeDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await productApi.delete(confirmDeleteId);
      toast.success('Produk dihapus');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menghapus');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const openModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setIsAddingCategory(false);
      setNewCategoryName('');
      setFormData({
        name: item.name, sku: item.sku || '', description: item.description || '', 
        unit: item.unit, shelfLifeDays: item.shelfLifeDays?.toString() || '', 
        categoryId: item.category.id, imageUrl: item.imageUrl || ''
      });
    } else {
      setEditingId(null);
      setIsAddingCategory(false);
      setNewCategoryName('');
      setFormData({ name: '', sku: '', description: '', unit: 'KG', shelfLifeDays: '', categoryId: categories[0]?.id || '', imageUrl: '' });
    }
    setIsModalOpen(true);
  };

  const filterOptions = [
    { value: '', label: 'Semua Kategori' },
    ...categories.map((c: any) => ({ value: c.id, label: c.name }))
  ];

  const sortOptions = [
    { value: 'name,asc', label: 'Nama A-Z' },
    { value: 'name,desc', label: 'Nama Z-A' },
    { value: 'createdAt,desc', label: 'Terbaru' },
    { value: 'createdAt,asc', label: 'Terlama' },
  ];

  const getImageUrl = (url: string | null) => {
    if (!url) return '';
    if (url.startsWith('/api')) return `http://localhost:8080${url}`;
    return url;
  };

  const columns = [
    { 
      key: 'product', 
      label: t('products.col_product'), 
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
            {item.imageUrl ? (
              <img src={getImageUrl(item.imageUrl)} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <Package className="text-slate-400" size={18} />
            )}
          </div>
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-100">{item.name}</p>
            <p className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.sku || '-'}</p>
          </div>
        </div>
      ) 
    },
    { key: 'category', label: t('products.col_category'), render: (item: any) => <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-700 dark:text-slate-300">{item.category?.name}</span> },
    { key: 'unit', label: t('products.col_unit'), render: (item: any) => <span className="text-slate-600 dark:text-slate-400">{item.unit}</span> },
    { key: 'shelfLifeDays', label: t('products.col_shelf_life'), render: (item: any) => <span className="text-slate-600 dark:text-slate-400">{item.shelfLifeDays ? `${item.shelfLifeDays} ${t('catalog.days')}` : '-'}</span> },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Package size={24} className="text-emerald-600" />
            {t('products.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('products.subtitle')}</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        error={loadError}
        onRetry={fetchData}
        page={page}
        pageSize={pageSize}
        onPageSizeChange={(size) => { setPageSize(size); setPage(0); }}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setPage}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('products.search_ph')}
        filterOptions={filterOptions}
        activeFilter={filterCategory}
        onFilterChange={(val) => { setFilterCategory(val); setPage(0); }}
        sortOptions={sortOptions}
        activeSort={sortBy}
        onSortChange={(val) => { setSortBy(val); setPage(0); }}
        headerActions={
          isAdminOrFarmer && (
            <button onClick={() => openModal()} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm shadow-emerald-500/30">
              <Plus size={16} /> {t('products.add_btn')}
            </button>
          )
        }
        actions={isAdminOrFarmer ? (item: any) => {
          const isOwner = user?.id === item.createdBy;
          const isAdmin = user?.role === 'PLATFORM_ADMIN';
          
          if (!isOwner && !isAdmin) return null;

          return (
            <div className="flex justify-end gap-2">
              <button onClick={() => setDetailItem(item)} className="p-1.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Detail">
                <Eye size={16} />
              </button>
              <button onClick={() => openModal(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title={t('common.edit')}>
                <Pencil size={16} />
              </button>
              <button onClick={() => setConfirmDeleteId(item.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors" title={t('common.delete')}>
                <Trash2 size={16} />
              </button>
            </div>
          );
        } : undefined}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? t('products.modal_edit') : t('products.modal_add')} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Produk *</label>
              <input type="text" required minLength={3} maxLength={150} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" placeholder="Contoh: Tomat Cherry" />
              {formErrors.name && <p className="mt-1 text-xs font-semibold text-rose-500">{formErrors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SKU (Opsional)</label>
              <input type="text" maxLength={50} value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" placeholder="TOM-CHE-01" />
              {formErrors.sku && <p className="mt-1 text-xs font-semibold text-rose-500">{formErrors.sku}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Kategori *</span>
                {!isAddingCategory ? (
                  <button type="button" onClick={() => setIsAddingCategory(true)} className="text-xs text-emerald-600 hover:text-emerald-700 font-bold">
                    + Kategori Baru
                  </button>
                ) : (
                  <button type="button" onClick={() => { setIsAddingCategory(false); setNewCategoryName(''); }} className="text-xs text-rose-600 hover:text-rose-700 font-bold">
                    Batal Tambah
                  </button>
                )}
              </label>
              
              {!isAddingCategory ? (
                <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm cursor-pointer bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                  <option value="">Pilih Kategori</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              ) : (
                <input 
                  type="text" 
                  required 
                  value={newCategoryName} 
                  onChange={e => setNewCategoryName(e.target.value)} 
                  className="w-full p-2 border border-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm placeholder-emerald-700/50 dark:text-emerald-300" 
                  placeholder="Ketik nama kategori baru..." 
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Satuan *</label>
              <select required value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                <option value="KG">Kilogram (KG)</option>
                <option value="GRAM">Gram</option>
                <option value="LITER">Liter</option>
                <option value="UNIT">Satuan (Unit)</option>
                <option value="BOX">Kardus (Box)</option>
                <option value="BUNCH">Ikat (Bunch)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Umur Simpan (Hari)</label>
              <input type="number" min="0" value={formData.shelfLifeDays} onChange={e => setFormData({...formData, shelfLifeDays: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" placeholder="Contoh: 7" />
              {formErrors.shelfLifeDays && <p className="mt-1 text-xs font-semibold text-rose-500">{formErrors.shelfLifeDays}</p>}
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deskripsi</label>
              <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" placeholder="Deskripsi opsional..." />
            </div>
<div className="col-span-2 border-t border-slate-100 dark:border-slate-700 pt-4 mt-2">
              <FileUpload 
                label="Foto Produk (Opsional)"
                acceptedTypes="image/jpeg,image/png"
                onUploadSuccess={(url) => setFormData({...formData, imageUrl: url})}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700 mt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Batal</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">Simpan Produk</button>
          </div>
        </form>
      </Modal>

      <DetailModal
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        title={detailItem?.name || t('products.title')}
        imageUrl={detailItem?.imageUrl ? getImageUrl(detailItem.imageUrl) : null}
        imageAlt={detailItem?.name}
        rows={[
          { label: t('products.col_product'), value: detailItem?.name },
          { label: 'SKU', value: detailItem?.sku || '-', mono: true },
          { label: t('products.col_category'), value: detailItem?.category?.name },
          { label: t('products.col_unit'), value: detailItem?.unit },
          { label: t('products.col_shelf_life'), value: detailItem?.shelfLifeDays ? `${detailItem.shelfLifeDays} ${t('catalog.days')}` : '-' },
          { label: t('common.status'), value: detailItem?.status },
          { label: 'Deskripsi', value: detailItem?.description || '-' },
        ]}
      />

      <ConfirmDialog 
        isOpen={!!confirmDeleteId}
        title="Hapus Produk"
        message="Apakah Anda yakin ingin menghapus produk ini? Riwayat produk pada batch yang sudah terjadi tidak akan hilang, namun Anda tidak bisa membuat batch baru untuk produk ini."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isDestructive={true}
        onConfirm={executeDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};

export default Products;
