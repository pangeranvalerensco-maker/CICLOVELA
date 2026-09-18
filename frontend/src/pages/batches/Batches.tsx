import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Tractor, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { batchApi, productApi } from '../../api/endpoints';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import DetailModal from '../../components/ui/DetailModal';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Batches = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const isFarmer = user?.role === 'FARMER';
  
  const [data, setData] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt,desc');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    batchCode: '', productId: '', harvestDate: '', initialQuantity: '', unit: 'KG', qualityGrade: 'A', expiryDate: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [sortField, sortDir] = sortBy.split(',');
      const params: any = { page, size: pageSize, search: search || '', sort: `${sortField},${sortDir}`, farmerId: isFarmer ? user?.id : undefined };
      if (filterStatus) params.status = filterStatus;
      const res = await batchApi.getAll(params);
      setData(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
      setTotalElements(res.data.data.totalElements);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal mengambil data batch';
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await productApi.getAll({ page: 0, size: 100, status: 'ACTIVE', search: '' });
      setProducts(res.data?.data?.content || []);
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat daftar produk');
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, search, filterStatus, sortBy]);

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

  const executeDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await batchApi.delete(confirmDeleteId);
      toast.success('Batch dibatalkan');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal membatalkan');
    } finally {
      setConfirmDeleteId(null);
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
      case 'ACTIVE': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'DEPLETED': return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600';
      case 'EXPIRED': return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20';
    }
  };

  const filterOptions = [
    { value: '', label: t('common.all') + ' ' + t('common.status') },
    { value: 'ACTIVE', label: 'ACTIVE' },
    { value: 'DEPLETED', label: 'DEPLETED' },
    { value: 'EXPIRED', label: 'EXPIRED' },
    { value: 'CANCELLED', label: 'CANCELLED' },
  ];

  const sortOptions = [
    { value: 'createdAt,desc', label: 'Terbaru' },
    { value: 'createdAt,asc', label: 'Terlama' },
    { value: 'harvestDate,desc', label: 'Panen Terbaru' },
    { value: 'harvestDate,asc', label: 'Panen Terlama' },
    { value: 'expiryDate,asc', label: 'Kedaluwarsa Terdekat' },
  ];

  const columns = [
    { key: 'batchCode', label: t('batches.col_code'), render: (item: any) => <span className="font-bold text-slate-800 dark:text-slate-100">{item.batchCode}</span> },
    { key: 'productName', label: t('batches.col_product'), render: (item: any) => <span className="text-slate-700 dark:text-slate-300">{item.productName}</span> },
    { key: 'harvestDate', label: t('batches.col_harvest'), render: (item: any) => <span className="text-slate-600 dark:text-slate-400">{new Date(item.harvestDate).toLocaleDateString('id-ID')}</span> },
    { key: 'expiryDate', label: t('batches.col_expiry'), render: (item: any) => <span className="text-rose-600 dark:text-rose-400 font-medium">{new Date(item.expiryDate).toLocaleDateString('id-ID')}</span> },
    { key: 'initialQuantity', label: t('batches.col_qty'), render: (item: any) => <span className="font-semibold text-slate-700 dark:text-slate-300">{item.initialQuantity} {item.unit}</span> },
    { key: 'qualityGrade', label: t('batches.col_quality'), render: (item: any) => <span className="px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 rounded text-xs font-bold">Grade {item.qualityGrade}</span> },
    { key: 'status', label: t('common.status'), render: (item: any) => <span className={`px-2 py-1 border rounded text-xs font-bold ${getStatusColor(item.status)}`}>{item.status}</span> },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Tractor size={24} className="text-emerald-600" />
            {t('batches.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('batches.subtitle')}</p>
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
        searchPlaceholder={t('batches.search_ph')}
        filterOptions={filterOptions}
        activeFilter={filterStatus}
        onFilterChange={(val) => { setFilterStatus(val); setPage(0); }}
        sortOptions={sortOptions}
        activeSort={sortBy}
        onSortChange={(val) => { setSortBy(val); setPage(0); }}
        headerActions={
          isFarmer && (
            <button onClick={() => openModal()} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm shadow-emerald-500/30">
              <Plus size={16} /> {t('batches.add_btn')}
            </button>
          )
        }
        actions={(item: any) => {
          const isOwner = isFarmer && user?.id === item.farmerId;

          return (
            <div className="flex justify-end gap-2">
              <button onClick={() => setDetailItem(item)} className="p-1.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Detail">
                <Eye size={16} />
              </button>
              {isOwner && (
                <>
                  <button onClick={() => openModal(item)} disabled={item.status !== 'ACTIVE'} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors disabled:opacity-30" title={t('common.edit')}>
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => setConfirmDeleteId(item.id)} disabled={item.status !== 'ACTIVE'} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-30" title={t('common.cancel')}>
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          );
        }}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? t('batches.modal_edit') : t('batches.modal_add')} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Produk *</label>
              <select required value={formData.productId} onChange={e => setFormData({...formData, productId: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                <option value="">Pilih Produk</option>
                {products.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kode Batch *</label>
              <input type="text" required value={formData.batchCode} onChange={e => setFormData({...formData, batchCode: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800" placeholder="KODE-BATCH" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Panen *</label>
              <input type="date" required value={formData.harvestDate} onChange={e => setFormData({...formData, harvestDate: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Kedaluwarsa *</label>
              <input type="date" required value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-800" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kuantitas Awal *</label>
              <div className="flex gap-2">
                <input type="number" step="0.001" min="0.001" disabled={!!editingId} required value={formData.initialQuantity} onChange={e => setFormData({...formData, initialQuantity: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" placeholder="Contoh: 100.5" />
                <select value={formData.unit} disabled={!!editingId} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-24 p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-slate-50 dark:bg-slate-800 disabled:opacity-70 text-slate-700 dark:text-slate-200">
                  <option value="KG">KG</option>
                  <option value="GRAM">Gram</option>
                  <option value="LITER">Liter</option>
                  <option value="UNIT">Unit</option>
                  <option value="BOX">Box</option>
                  <option value="BUNCH">Ikat</option>
                </select>
              </div>
              {!!editingId && <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Kuantitas awal tidak dapat diubah setelah batch dibuat.</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kualitas (Grade) *</label>
              <select required value={formData.qualityGrade} onChange={e => setFormData({...formData, qualityGrade: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                <option value="A">Grade A (Terbaik)</option>
                <option value="B">Grade B (Standar)</option>
                <option value="C">Grade C (Kurang)</option>
                <option value="REJECTED">Ditolak (Rejected)</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-slate-100 dark:border-slate-700">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Batal</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">Simpan Batch</button>
          </div>
        </form>
      </Modal>

      <DetailModal
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        title={detailItem?.batchCode || t('batches.title')}
        rows={[
          { label: t('batches.col_code'), value: detailItem?.batchCode, mono: true },
          { label: t('batches.col_product'), value: detailItem?.productName },
          { label: t('batches.col_harvest'), value: detailItem?.harvestDate },
          { label: t('batches.col_expiry'), value: detailItem?.expiryDate },
          { label: t('batches.col_qty'), value: detailItem ? `${detailItem.initialQuantity} ${detailItem.unit}` : null },
          { label: t('batches.col_quality'), value: detailItem?.qualityGrade ? `Grade ${detailItem.qualityGrade}` : null },
          { label: t('common.status'), value: detailItem?.status },
        ]}
      />

      <ConfirmDialog 
        isOpen={!!confirmDeleteId}
        title="Batalkan Batch"
        message="Apakah Anda yakin ingin membatalkan/menghapus batch ini? Jika batch ini sudah memiliki transaksi, maka datanya tidak dapat dihapus."
        confirmText="Ya, Batalkan"
        cancelText="Kembali"
        isDestructive={true}
        onConfirm={executeDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};

export default Batches;
