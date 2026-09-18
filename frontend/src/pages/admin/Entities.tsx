import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Building2, CheckCircle, ExternalLink, XCircle, Eye } from 'lucide-react';
import { businessApi } from '../../api/endpoints';
import DataTable from '../../components/ui/DataTable';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import DetailModal from '../../components/ui/DetailModal';

const Entities = () => {
  const [data, setData] = useState<any[]>([]);
  const [detailItem, setDetailItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt,desc');

  const [confirmApproveId, setConfirmApproveId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [sortField, sortDir] = sortBy.split(',');
      const params: any = { page, size: pageSize, search: search || '', sort: `${sortField},${sortDir}` };
      if (filterStatus) params.verificationStatus = filterStatus;
      const res = await businessApi.getAll(params);
      setData(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
      setTotalElements(res.data.data.totalElements);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal mengambil data entitas bisnis';
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, pageSize, search, filterStatus, sortBy]);

  const executeApprove = async () => {
    if (!confirmApproveId) return;
    try {
      await businessApi.approve(confirmApproveId);
      toast.success('Entitas bisnis berhasil disetujui!');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyetujui');
    } finally {
      setConfirmApproveId(null);
    }
  };

  const filterOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'PENDING', label: 'Menunggu Verifikasi' },
    { value: 'APPROVED', label: 'Disetujui' },
    { value: 'REJECTED', label: 'Ditolak' },
  ];

  const sortOptions = [
    { value: 'createdAt,desc', label: 'Terbaru' },
    { value: 'createdAt,asc', label: 'Terlama' },
    { value: 'name,asc', label: 'Nama A-Z' },
    { value: 'name,desc', label: 'Nama Z-A' },
  ];

  const columns = [
    { key: 'name', label: 'Nama Bisnis', render: (item: any) => (
      <div>
        <span className="font-bold text-slate-800 dark:text-slate-100 block">{item.name}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{item.legalName || 'Non-PT'}</span>
      </div>
    )},
    { key: 'businessType', label: 'Tipe', render: (item: any) => <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400">{item.businessType}</span> },
    { key: 'city', label: 'Lokasi', render: (item: any) => <span className="text-slate-600 dark:text-slate-400">{item.city}, {item.province}</span> },
    { key: 'verificationDocumentUrl', label: 'Dokumen', render: (item: any) => (
      item.verificationDocumentUrl ? 
      <a href={item.verificationDocumentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline">
        <ExternalLink size={14} /> Lihat PDF
      </a> : <span className="text-xs text-slate-400 dark:text-slate-500">Tidak ada</span>
    )},
    { key: 'verificationStatus', label: 'Status Verifikasi', render: (item: any) => {
      const isApproved = item.verificationStatus === 'APPROVED';
      return (
        <span className={`px-2 py-1 border rounded text-xs font-bold flex items-center gap-1 w-max ${isApproved ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'}`}>
          {isApproved ? <CheckCircle size={14} /> : <XCircle size={14} />} {item.verificationStatus}
        </span>
      )
    }}
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Building2 size={24} className="text-emerald-600" /> Verifikasi Entitas Bisnis
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Tinjau dan setujui pendaftaran Perusahaan (Admin Only).</p>
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
        searchPlaceholder="Cari nama bisnis..."
        filterOptions={filterOptions}
        activeFilter={filterStatus}
        onFilterChange={(val) => { setFilterStatus(val); setPage(0); }}
        sortOptions={sortOptions}
        activeSort={sortBy}
        onSortChange={(val) => { setSortBy(val); setPage(0); }}
        actions={(item: any) => (
          <div className="flex justify-end gap-2">
            <button onClick={() => setDetailItem(item)} className="p-1.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" title="Detail">
              <Eye size={16} />
            </button>
            {item.verificationStatus === 'PENDING' && (
              <button onClick={() => setConfirmApproveId(item.id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-sm">
                Setujui Bisnis
              </button>
            )}
          </div>
        )}
      />

      <DetailModal
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        title={detailItem?.name || 'Entitas Bisnis'}
        rows={[
          { label: 'Nama Bisnis', value: detailItem?.name },
          { label: 'Nama Legal', value: detailItem?.legalName || '-' },
          { label: 'Tipe', value: detailItem?.businessType },
          { label: 'Status Verifikasi', value: detailItem?.verificationStatus },
          { label: 'Status', value: detailItem?.status },
          { label: 'Email', value: detailItem?.email || '-' },
          { label: 'Telepon', value: detailItem?.phone || '-' },
          { label: 'Alamat', value: detailItem?.address },
          { label: 'Kota', value: detailItem?.city },
          { label: 'Provinsi', value: detailItem?.province },
          { label: 'Kode Pos', value: detailItem?.postalCode || '-' },
        ]}
      />

      <ConfirmDialog 
        isOpen={!!confirmApproveId}
        title="Konfirmasi Persetujuan"
        message="Apakah Anda yakin ingin menyetujui Entitas Bisnis ini? Entitas akan mendapatkan akses ke gudang inventaris dan dapat memulai transaksi resmi di dalam platform."
        confirmText="Ya, Setujui"
        cancelText="Batal"
        isDestructive={false}
        onConfirm={executeApprove}
        onCancel={() => setConfirmApproveId(null)}
      />
    </div>
  );
};
export default Entities;
