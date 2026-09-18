import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Layers, Eye } from 'lucide-react';
import { inventoryApi } from '../../api/endpoints';
import DataTable from '../../components/ui/DataTable';
import DetailModal from '../../components/ui/DetailModal';
import { useTranslation } from 'react-i18next';

const Inventories = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [detailItem, setDetailItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt,desc');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sortField, sortDir] = sortBy.split(',');
      const params: any = { page, size: 10, search: search || '', sort: `${sortField},${sortDir}` };
      if (filterType) params.accountType = filterType;
      const res = await inventoryApi.getAll(params);
      setData(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
      setTotalElements(res.data.data.totalElements);
    } catch (err) {
      toast.error('Gagal mengambil data inventaris');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, filterType, sortBy]);

  const filterOptions = [
    { value: '', label: t('common.all') + ' ' + t('common.status') },
    { value: 'USER', label: 'Personal (User)' },
    { value: 'BUSINESS_ENTITY', label: 'Entitas Bisnis' },
  ];

  const sortOptions = [
    { value: 'updatedAt,desc', label: 'Terbaru Diupdate' },
    { value: 'updatedAt,asc', label: 'Terlama Diupdate' },
    { value: 'quantity,desc', label: 'Stok Terbanyak' },
    { value: 'quantity,asc', label: 'Stok Tersedikit' },
  ];

  const getImageUrl = (url: string | null) => {
    if (!url) return '';
    if (url.startsWith('/api')) return `http://localhost:8080${url}`;
    return url;
  };

  const columns = [
    { 
      key: 'product', 
      label: t('inventories.col_product'), 
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
            {item.imageUrl ? (
              <img src={getImageUrl(item.imageUrl)} alt={item.productName} className="w-full h-full object-cover" />
            ) : (
              <Layers className="text-slate-400" size={18} />
            )}
          </div>
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-100">{item.productName || 'Memuat produk...'}</p>
            <p className="font-mono text-xs text-slate-500 dark:text-slate-400 break-all w-32 inline-block leading-tight mt-0.5">{item.batchCode || item.batchId}</p>
          </div>
        </div>
      ) 
    },
    { key: 'quantity', label: t('inventories.col_available'), render: (item: any) => <span className="font-bold text-slate-800 dark:text-slate-100">{item.availableQuantity}</span> },
    { key: 'reservedQuantity', label: t('inventories.col_reserved'), render: (item: any) => <span className="text-slate-600 dark:text-slate-400">{item.reservedQuantity}</span> },
    { key: 'accountType', label: t('inventories.col_owner'), render: (item: any) => <span className="px-2 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded text-xs font-bold">{item.accountType === 'USER' ? 'Personal' : 'Entitas'}</span> },
    { key: 'updatedAt', label: t('inventories.col_update'), render: (item: any) => <span className="text-slate-600 dark:text-slate-400 text-xs">{new Date(item.updatedAt).toLocaleString('id-ID')}</span> },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Layers size={24} className="text-emerald-600" />
            {t('inventories.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('inventories.subtitle')}</p>
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
        onSearchChange={(val) => { setSearch(val); setPage(0); }}
        searchPlaceholder={t('inventories.search_ph')}
        filterOptions={filterOptions}
        activeFilter={filterType}
        onFilterChange={(val) => { setFilterType(val); setPage(0); }}
        sortOptions={sortOptions}
        activeSort={sortBy}
        onSortChange={(val) => { setSortBy(val); setPage(0); }}
        actions={(item: any) => (
          <div className="flex justify-end gap-2">
            <button onClick={() => setDetailItem(item)} className="p-1.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Detail">
              <Eye size={16} />
            </button>
          </div>
        )}
      />

      <DetailModal
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        title={detailItem?.productName || t('inventories.title')}
        rows={[
          { label: t('inventories.col_product'), value: detailItem?.productName },
          { label: t('batches.col_code'), value: detailItem?.batchCode, mono: true },
          { label: 'ID Batch', value: detailItem?.batchId, mono: true },
          { label: t('inventories.col_available'), value: detailItem?.availableQuantity },
          { label: t('inventories.col_reserved'), value: detailItem?.reservedQuantity },
          { label: t('inventories.col_owner'), value: detailItem?.accountType },
          { label: t('inventories.col_update'), value: detailItem?.updatedAt ? new Date(detailItem.updatedAt).toLocaleString('id-ID') : null },
        ]}
      />
    </div>
  );
};

export default Inventories;
