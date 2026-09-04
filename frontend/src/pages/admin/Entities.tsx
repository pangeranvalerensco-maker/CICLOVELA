import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Building2, CheckCircle, ExternalLink, XCircle } from 'lucide-react';
import { businessApi } from '../../api/endpoints';
import DataTable from '../../components/ui/DataTable';

const Entities = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await businessApi.getAll({ page, size: 10 });
      setData(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
      setTotalElements(res.data.data.totalElements);
    } catch (err) {
      toast.error('Gagal mengambil data entitas bisnis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleApprove = async (id: string) => {
    if (!window.confirm('Setujui perusahaan ini untuk bertransaksi?')) return;
    try {
      await businessApi.approve(id);
      toast.success('Entitas bisnis berhasil disetujui!');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyetujui');
    }
  };

  const columns = [
    { key: 'name', label: 'Nama Bisnis', render: (item: any) => (
      <div>
        <span className="font-bold text-slate-800 block">{item.name}</span>
        <span className="text-xs text-slate-500">{item.legalName || 'Non-PT'}</span>
      </div>
    )},
    { key: 'businessType', label: 'Tipe', render: (item: any) => <span className="font-mono text-xs font-bold text-slate-600">{item.businessType}</span> },
    { key: 'city', label: 'Lokasi', render: (item: any) => <span className="text-slate-600">{item.city}, {item.province}</span> },
    { key: 'verificationDocumentUrl', label: 'Dokumen', render: (item: any) => (
      item.verificationDocumentUrl ? 
      <a href={item.verificationDocumentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
        <ExternalLink size={14} /> Lihat PDF
      </a> : <span className="text-xs text-slate-400">Tidak ada</span>
    )},
    { key: 'verificationStatus', label: 'Status Verifikasi', render: (item: any) => {
      const isApproved = item.verificationStatus === 'APPROVED';
      return (
        <span className={`px-2 py-1 border rounded text-xs font-bold flex items-center gap-1 w-max ${isApproved ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
          {isApproved ? <CheckCircle size={14} /> : <XCircle size={14} />} {item.verificationStatus}
        </span>
      )
    }}
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Building2 size={24} className="text-emerald-600" /> Verifikasi Entitas Bisnis
          </h1>
          <p className="text-slate-500 text-sm mt-1">Tinjau dan setujui pendaftaran Perusahaan (Admin Only).</p>
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
        actions={(item: any) => (
          <div className="flex justify-end gap-2">
            {item.verificationStatus === 'PENDING' && (
              <button onClick={() => handleApprove(item.id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-sm">
                Setujui Bisnis
              </button>
            )}
          </div>
        )}
      />
    </div>
  );
};
export default Entities;
