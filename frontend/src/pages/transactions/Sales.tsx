import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Store, Plus, Check } from 'lucide-react';
import { saleApi, businessApi, inventoryApi, membershipApi, userApi } from '../../api/endpoints';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useTranslation } from 'react-i18next';
import { notify } from '../../utils/notify';
import { isPositiveNumber } from '../../utils/validation';

const Sales = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('transactionDate,desc');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [confirmStatusData, setConfirmStatusData] = useState<{id: string, status: string, title: string, message: string} | null>(null);
  const [sellerMemberships, setSellerMemberships] = useState<any[]>([]);
  const [buyerEntities, setBuyerEntities] = useState<any[]>([]);
  const [buyers, setBuyers] = useState<any[]>([]);
  const [sellerStocks, setSellerStocks] = useState<any[]>([]);
  const [buyerType, setBuyerType] = useState<'ENTITY' | 'USER'>('ENTITY');
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [formData, setFormData] = useState({
    sellerEntityId: '', buyerEntityId: '', buyerUserId: '', notes: '', batchId: '', quantity: '', unitPrice: ''
  });

  const fetchData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [sortField, sortDir] = sortBy.split(',');
      const params: any = { page, size: pageSize, search: search || '', sort: `${sortField},${sortDir}` };
      if (filterStatus) params.status = filterStatus;
      if (startDate) params.startDate = new Date(`${startDate}T00:00:00`).toISOString();
      if (endDate) params.endDate = new Date(`${endDate}T23:59:59`).toISOString();
      const res = await saleApi.getAll(params);
      setData(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
      setTotalElements(res.data.data.totalElements);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal mengambil data penjualan';
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, search, filterStatus, startDate, endDate, sortBy]);

  const openCreateModal = async () => {
    setIsModalOpen(true);
    setLoadingOptions(true);
    try {
      const membershipRes = await membershipApi.getMine().catch(() => ({ data: { data: [] } }));
      const entityRes = await businessApi.getAll({ page: 0, size: 100 }).catch(() => ({ data: { data: { content: [] } } }));
      const consumerRes = await userApi.getDirectory('CONSUMER').catch(() => ({ data: { data: [] } }));
      
      const memberships = membershipRes.data?.data || [];
      const entities = entityRes.data?.data?.content || [];
      const consumerList = Array.isArray(consumerRes.data?.data) ? consumerRes.data.data : [];
      
      setSellerMemberships(memberships);
      setBuyerEntities(entities);
      setBuyers(consumerList);
      setSellerStocks([]);
      setFormData({ sellerEntityId: memberships[0]?.businessEntityId || '', buyerEntityId: '', buyerUserId: '', notes: '', batchId: '', quantity: '', unitPrice: '' });
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat pilihan penjualan');
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleSellerChange = async (entityId: string) => {
    setFormData({ ...formData, sellerEntityId: entityId, batchId: '' });
    if (!entityId) {
      setSellerStocks([]);
      return;
    }
    try {
      const res = await inventoryApi.getOptions(entityId);
      const stocks = res.data?.data || [];
      setSellerStocks(stocks);
      if (stocks.length === 0) notify.warning(t('common.no_data'));
      else notify.info(`${stocks.length} stok gudang dimuat`);
    } catch (err) {
      toast.error('Gagal memuat stok penjual');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPositiveNumber(formData.quantity) || !isPositiveNumber(formData.unitPrice)) {
      notify.warning(t('common.validation_positive'));
      return;
    }
    try {
      if (buyerType === 'ENTITY' && !formData.buyerEntityId) {
        toast.error('Pilih entitas pembeli terlebih dahulu');
        return;
      }
      if (buyerType === 'USER' && !formData.buyerUserId) {
        toast.error('Pilih consumer pembeli terlebih dahulu');
        return;
      }
      const payload = {
        sellerEntityId: formData.sellerEntityId,
        buyerEntityId: buyerType === 'ENTITY' ? formData.buyerEntityId : null,
        buyerUserId: buyerType === 'USER' ? formData.buyerUserId : null,
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

  const executeUpdateStatus = async () => {
    if (!confirmStatusData) return;
    try {
      await saleApi.updateStatus(confirmStatusData.id, confirmStatusData.status);
      toast.success(`Status berhasil diubah menjadi ${confirmStatusData.status}`);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengubah status');
    } finally {
      setConfirmStatusData(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20';
    }
  };

  const filterOptions = [
    { value: '', label: t('common.all') + ' ' + t('common.status') },
    { value: 'PENDING', label: 'PENDING' },
    { value: 'CONFIRMED', label: 'CONFIRMED' },
    { value: 'COMPLETED', label: 'COMPLETED' },
    { value: 'CANCELLED', label: 'CANCELLED' },
  ];

  const sortOptions = [
    { value: 'transactionDate,desc', label: 'Terbaru' },
    { value: 'transactionDate,asc', label: 'Terlama' },
    { value: 'totalAmount,desc', label: 'Nominal Terbesar' },
    { value: 'totalAmount,asc', label: 'Nominal Terkecil' },
  ];

  const columns = [
    { key: 'transactionCode', label: t('sales.col_code'), render: (item: any) => <span className="font-bold text-slate-800 dark:text-slate-100">{item.transactionCode}</span> },
    { key: 'transactionDate', label: t('sales.col_date'), render: (item: any) => <span className="text-slate-600 dark:text-slate-400">{new Date(item.transactionDate).toLocaleDateString('id-ID')}</span> },
    { key: 'totalAmount', label: t('sales.col_total'), render: (item: any) => <span className="font-semibold text-slate-700 dark:text-slate-300">Rp {item.totalAmount.toLocaleString('id-ID')}</span> },
    { key: 'status', label: t('common.status'), render: (item: any) => <span className={`px-2 py-1 border rounded text-xs font-bold ${getStatusColor(item.status)}`}>{item.status}</span> },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Store size={24} className="text-emerald-600" />
            {t('sales.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('sales.subtitle')}</p>
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
        onSearchChange={(val) => { setSearch(val); setPage(0); }}
        searchPlaceholder={t('sales.search_ph')}
        filterOptions={filterOptions}
        activeFilter={filterStatus}
        onFilterChange={(val) => { setFilterStatus(val); setPage(0); }}
        sortOptions={sortOptions}
        activeSort={sortBy}
        onSortChange={(val) => { setSortBy(val); setPage(0); }}
        filters={
          <div className="flex items-center gap-2">
            <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(0); }} className="px-2 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none" />
            <span className="text-xs text-slate-400">s/d</span>
            <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(0); }} className="px-2 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none" />
          </div>
        }
        headerActions={
          <button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm shadow-emerald-500/30">
            <Plus size={16} /> {t('sales.add_btn')}
          </button>
        }
        actions={(item: any) => (
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => { setSelectedTransaction(item); setDetailModalOpen(true); }}
              className="p-1.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Lihat Detail">
              <Store size={16} />
            </button>
            {item.status === 'PENDING' && (
              <button 
                onClick={() => setConfirmStatusData({
                  id: item.id, status: 'CONFIRMED', title: 'Konfirmasi Penjualan', 
                  message: 'Anda yakin ingin mengkonfirmasi pesanan ini? Aksi ini menandakan persetujuan dari pihak pembeli.'
                })} 
                className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="Konfirmasi">
                <Check size={16} />
              </button>
            )}
            {item.status === 'CONFIRMED' && (
              <button 
                onClick={() => setConfirmStatusData({
                  id: item.id, status: 'COMPLETED', title: 'Selesaikan Penjualan', 
                  message: 'Barang telah dikirim dan pesanan selesai? Peringatan: Stok akan dipotong permanen dari gudang Anda.'
                })}
                className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors" title="Selesaikan & Kurangi Stok">
                <Check size={16} />
              </button>
            )}
          </div>
        )}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('sales.modal_add')} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-lg mb-4 text-sm text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">
            {loadingOptions ? 'Memuat pilihan entitas, pembeli, dan stok gudang...' : 'Pilih entitas penjual dari membership Anda, lalu pilih stok yang tersedia di gudang entitas tersebut.'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Entitas Penjual (Milik Anda)*</label>
              <select required value={formData.sellerEntityId} onChange={e => handleSellerChange(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                <option value="">Pilih Entitas Penjual</option>
                {sellerMemberships.map((membership: any) => <option key={membership.businessEntityId} value={membership.businessEntityId}>{membership.businessName} • {membership.businessType}</option>)}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipe Pembeli*</label>
              <select value={buyerType} onChange={e => { setBuyerType(e.target.value as 'ENTITY' | 'USER'); setFormData({ ...formData, buyerEntityId: '', buyerUserId: '' }); }} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                <option value="ENTITY">Entitas Bisnis (B2B: Distributor → Retailer)</option>
                <option value="USER">Consumer Langsung (B2C: Retailer → Consumer)</option>
              </select>
            </div>
            
            {buyerType === 'ENTITY' ? (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Entitas Pembeli*</label>
                <select required value={formData.buyerEntityId} onChange={e => setFormData({...formData, buyerEntityId: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                  <option value="">Pilih Entitas Pembeli</option>
                  {buyerEntities.map((entity: any) => <option key={entity.id} value={entity.id}>{entity.name} • {entity.businessType}</option>)}
                </select>
              </div>
            ) : (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Consumer Pembeli*</label>
                <select required value={formData.buyerUserId} onChange={e => setFormData({...formData, buyerUserId: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                  <option value="">Pilih Consumer</option>
                  {buyers.map((buyer: any) => <option key={buyer.id} value={buyer.id}>{buyer.name} • {buyer.email}</option>)}
                </select>
              </div>
            )}

            <div className="col-span-2 border-t border-slate-200 dark:border-slate-700 mt-2 pt-4">
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Item Penjualan</h4>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Batch di Gudang Penjual *</label>
              <select required value={formData.batchId} onChange={e => setFormData({...formData, batchId: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                <option value="">Pilih Stok Gudang</option>
                {sellerStocks.map((stock: any) => <option key={stock.batchId} value={stock.batchId}>{stock.batchId} • tersedia {stock.availableQuantity} KG</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kuantitas *</label>
              <input type="number" step="0.001" min="0.001" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" placeholder="Misal: 10.5" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Harga Satuan (Rp) *</label>
              <input type="number" step="0.01" min="0" required value={formData.unitPrice} onChange={e => setFormData({...formData, unitPrice: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" placeholder="Misal: 25000" />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Catatan</label>
              <textarea rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" placeholder="Opsional..." />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-slate-100 dark:border-slate-700">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Batal</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">Buat Penjualan</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} title="Detail Transaksi Penjualan" size="md">
        {selectedTransaction && (
          <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
            <div className="grid grid-cols-2 gap-y-3">
              <div><span className="block text-slate-500 text-xs">Kode Transaksi</span><strong className="text-slate-800 dark:text-white">{selectedTransaction.transactionCode}</strong></div>
              <div><span className="block text-slate-500 text-xs">Status</span><span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(selectedTransaction.status)}`}>{selectedTransaction.status}</span></div>
              <div><span className="block text-slate-500 text-xs">Tanggal</span>{new Date(selectedTransaction.transactionDate).toLocaleString('id-ID')}</div>
              <div><span className="block text-slate-500 text-xs">Total Penjualan</span><strong className="text-emerald-600 dark:text-emerald-400">Rp {selectedTransaction.totalAmount.toLocaleString('id-ID')}</strong></div>
              <div className="col-span-2"><span className="block text-slate-500 text-xs">Catatan</span>{selectedTransaction.notes || '-'}</div>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-800 dark:text-white mb-2">Item Barang</h4>
              {selectedTransaction.items?.map((item: any) => (
                <div key={item.id} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg flex justify-between items-center mb-2 border border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-100">{item.productName || 'Memuat produk...'}</p>
                    <p className="font-mono text-xs text-slate-500 mb-1">{item.batchCode || item.batchId.substring(0,8)}</p>
                    <p className="text-sm font-medium">{item.quantity} x Rp {item.unitPrice.toLocaleString('id-ID')}</p>
                  </div>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">Rp {item.subtotal.toLocaleString('id-ID')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog 
        isOpen={!!confirmStatusData}
        title={confirmStatusData?.title || 'Ubah Status'}
        message={confirmStatusData?.message}
        confirmText="Ya, Lanjutkan"
        cancelText="Batal"
        onConfirm={executeUpdateStatus}
        onCancel={() => setConfirmStatusData(null)}
      />
    </div>
  );
};

export default Sales;
