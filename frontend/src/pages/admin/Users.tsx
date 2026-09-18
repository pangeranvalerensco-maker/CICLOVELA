import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Users as UsersIcon, Check, Ban, Eye } from 'lucide-react';
import { userApi } from '../../api/endpoints';
import DataTable from '../../components/ui/DataTable';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import DetailModal from '../../components/ui/DetailModal';
import api from '../../api/axios'; // direct axios for admin patch

const Users = () => {
  const [data, setData] = useState<any[]>([]);
  const [detailItem, setDetailItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('name,asc');

  const [confirmStatusData, setConfirmStatusData] = useState<{id: string, status: string, name: string} | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sortField, sortDir] = sortBy.split(',');
      const params: any = { page, size: 10, search: search || '', sort: `${sortField},${sortDir}` };
      if (filterRole) params.role = filterRole;
      if (filterStatus) params.status = filterStatus;
      const res = await userApi.getAll(params);
      setData(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
      setTotalElements(res.data.data.totalElements);
    } catch (err) {
      toast.error('Gagal mengambil data pengguna');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, search, filterRole, filterStatus, sortBy]);

  const executeUpdateStatus = async () => {
    if (!confirmStatusData) return;
    try {
      await api.patch(`/users/${confirmStatusData.id}/status`, { status: confirmStatusData.status });
      toast.success(`Status pengguna berhasil diubah menjadi ${confirmStatusData.status}`);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengubah status pengguna');
    } finally {
      setConfirmStatusData(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'SUSPENDED': return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
      case 'INACTIVE': return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filterOptions = [
    { value: '', label: 'Semua Role' },
    { value: 'FARMER', label: 'FARMER' },
    { value: 'CONSUMER', label: 'CONSUMER' },
    { value: 'PLATFORM_ADMIN', label: 'PLATFORM_ADMIN' }
  ];

  const sortOptions = [
    { value: 'name,asc', label: 'Nama A-Z' },
    { value: 'name,desc', label: 'Nama Z-A' },
    { value: 'createdAt,desc', label: 'Terbaru' },
  ];

  const columns = [
    { key: 'name', label: 'Nama & Kontak', render: (item: any) => (
      <div>
        <span className="font-bold text-slate-800 dark:text-slate-100 block">{item.name}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{item.email} • {item.phone || '-'}</span>
      </div>
    )},
    { key: 'role', label: 'Role', render: (item: any) => <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{item.role}</span> },
    { key: 'city', label: 'Lokasi', render: (item: any) => <span className="text-slate-600 dark:text-slate-400">{item.city || '-'}, {item.province || '-'}</span> },
    { key: 'status', label: 'Status', render: (item: any) => (
      <span className={`px-2 py-1 border rounded text-xs font-bold ${getStatusColor(item.status)}`}>
        {item.status}
      </span>
    )}
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <UsersIcon size={24} className="text-emerald-600" /> Manajemen Pengguna
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Pantau dan kelola seluruh pengguna platform CICLOVELA (Admin Only).</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <select value={filterStatus} onChange={e => {setFilterStatus(e.target.value); setPage(0);}} className="p-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none">
            <option value="">Semua Status</option>
            <option value="ACTIVE">Aktif</option>
            <option value="SUSPENDED">Ditangguhkan</option>
        </select>
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
        searchPlaceholder="Cari nama atau email..."
        filterOptions={filterOptions}
        activeFilter={filterRole}
        onFilterChange={(val) => { setFilterRole(val); setPage(0); }}
        sortOptions={sortOptions}
        activeSort={sortBy}
        onSortChange={(val) => { setSortBy(val); setPage(0); }}
        actions={(item: any) => (
          <div className="flex justify-end gap-2">
            <button onClick={() => setDetailItem(item)} className="p-1.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Detail">
              <Eye size={16} />
            </button>
            {item.status === 'ACTIVE' && item.role !== 'PLATFORM_ADMIN' && (
              <button onClick={() => setConfirmStatusData({id: item.id, status: 'SUSPENDED', name: item.name})} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors" title="Suspend Akun">
                <Ban size={16} />
              </button>
            )}
            {item.status === 'SUSPENDED' && (
              <button onClick={() => setConfirmStatusData({id: item.id, status: 'ACTIVE', name: item.name})} className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors" title="Aktifkan Kembali">
                <Check size={16} />
              </button>
            )}
          </div>
        )}
      />

      <DetailModal
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        title={detailItem?.name || 'Pengguna'}
        rows={[
          { label: 'Nama', value: detailItem?.name },
          { label: 'Email', value: detailItem?.email },
          { label: 'Telepon', value: detailItem?.phone || '-' },
          { label: 'Role', value: detailItem?.role },
          { label: 'Status', value: detailItem?.status },
          { label: 'Kota', value: detailItem?.city || '-' },
          { label: 'Provinsi', value: detailItem?.province || '-' },
        ]}
      />

      <ConfirmDialog 
        isOpen={!!confirmStatusData}
        title={confirmStatusData?.status === 'SUSPENDED' ? 'Tangguhkan Pengguna' : 'Aktifkan Pengguna'}
        message={`Apakah Anda yakin ingin mengubah status akun "${confirmStatusData?.name}" menjadi ${confirmStatusData?.status}?`}
        confirmText="Ya, Ubah Status"
        cancelText="Batal"
        isDestructive={confirmStatusData?.status === 'SUSPENDED'}
        onConfirm={executeUpdateStatus}
        onCancel={() => setConfirmStatusData(null)}
      />
    </div>
  );
};
export default Users;
