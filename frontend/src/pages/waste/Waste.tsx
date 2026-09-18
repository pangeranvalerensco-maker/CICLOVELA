import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Trash2, AlertCircle, Eye, Plus } from 'lucide-react';
import { wasteApi, inventoryApi } from '../../api/endpoints';
import DataTable from '../../components/ui/DataTable';
import DetailModal from '../../components/ui/DetailModal';
import { useTranslation } from 'react-i18next';
import { notify } from '../../utils/notify';
import { isPositiveNumber, isRequired } from '../../utils/validation';

const Waste = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    inventoryId: '',
    quantity: '',
    reason: 'EXPIRED',
    notes: ''
  });

  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [stocks, setStocks] = useState<any[]>([]);
  const [detailItem, setDetailItem] = useState<any>(null);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await wasteApi.getAll({ page, size: pageSize });
      setHistory(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
      setTotalElements(res.data.data.totalElements);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal mengambil riwayat limbah';
      setHistoryError(message);
      toast.error(message);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchStocks = async () => {
    try {
      const res = await inventoryApi.getAll({ page: 0, size: 100 });
      setStocks(res.data?.data?.content || []);
    } catch {
      // diamkan, form tetap bisa isi manual
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, pageSize]);

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRequired(formData.inventoryId)) {
      notify.warning(t('common.validation_required'));
      return;
    }
    if (!isPositiveNumber(formData.quantity)) {
      notify.warning(t('common.validation_positive'));
      return;
    }
    notify.info(t('waste.processing'));
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
      setPage(0);
      fetchHistory();
      fetchStocks();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan saat mencatat limbah');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'recordedAt', label: 'Tanggal', render: (item: any) => <span className="text-slate-600 dark:text-slate-400">{new Date(item.recordedAt).toLocaleString('id-ID')}</span> },
    { key: 'reason', label: 'Alasan', render: (item: any) => <span className="px-2 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded text-xs font-bold">{item.reason}</span> },
    { key: 'quantity', label: 'Kuantitas', render: (item: any) => <span className="font-bold text-slate-800 dark:text-slate-100">{item.quantity}</span> },
    { key: 'notes', label: 'Catatan', render: (item: any) => <span className="text-slate-600 dark:text-slate-400">{item.notes || '-'}</span> },
  ];

  return (
    <div className="animate-in fade-in duration-500 space-y-8 max-w-4xl mx-auto">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Trash2 size={24} className="text-rose-600" />
          {t('waste.title')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('waste.subtitle')}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border-b border-rose-100 dark:border-rose-500/20 flex gap-3 items-start">
          <AlertCircle className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-rose-800 dark:text-rose-300">
            <strong>Perhatian:</strong> {t('waste.warning')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stok Gudang *</label>
            <select
              required
              value={formData.inventoryId}
              onChange={e => setFormData({ ...formData, inventoryId: e.target.value })}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="">Pilih stok dari gudang Anda</option>
              {stocks.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.productName || s.batchCode || s.id} • tersedia {s.availableQuantity}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kuantitas Dibuang *</label>
              <input
                type="number"
                step="0.001"
                min="0.001"
                required
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                placeholder="Misal: 5.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Alasan *</label>
              <select
                required
                value={formData.reason}
                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Catatan Tambahan</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              placeholder="Jelaskan detail kerusakan atau alasan pembuangan..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-sm shadow-rose-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              {loading ? t('waste.processing') : t('waste.submit_btn')}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Riwayat Limbah</h2>
        <DataTable
          columns={columns}
          data={history}
          loading={historyLoading}
          error={historyError}
          onRetry={fetchHistory}
          page={page}
          pageSize={pageSize}
          onPageSizeChange={(size) => { setPageSize(size); setPage(0); }}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={setPage}
          actions={(item: any) => (
            <div className="flex justify-end gap-2">
              <button onClick={() => setDetailItem(item)} className="p-1.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Detail">
                <Eye size={16} />
              </button>
            </div>
          )}
        />
      </div>

      <DetailModal
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        title="Detail Limbah"
        rows={[
          { label: 'Tanggal', value: detailItem?.recordedAt ? new Date(detailItem.recordedAt).toLocaleString('id-ID') : null },
          { label: 'Alasan', value: detailItem?.reason },
          { label: 'Kuantitas', value: detailItem?.quantity },
          { label: 'Batch ID', value: detailItem?.batchId, mono: true },
          { label: 'Inventory ID', value: detailItem?.inventoryId, mono: true },
          { label: 'Catatan', value: detailItem?.notes || '-' },
        ]}
      />
    </div>
  );
};

export default Waste;
