import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Layers } from 'lucide-react';
import { inventoryApi } from '../../api/endpoints';
import DataTable from '../../components/ui/DataTable';

const Inventories = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      // API request will be automatically secured by token.
      // Filtering by accountId is done either manually or backend does it by token.
      // Our backend doesn't filter implicitly, so ideally we pass accountId here if needed,
      // but for MVP we fetch all permitted or we let user see their own.
      const res = await inventoryApi.getAll({ page, size: 10 });
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
  }, [page]);

  const columns = [
    { key: 'batchId', label: 'ID Batch', render: (item: any) => <span className="font-mono text-xs text-slate-500">{item.batchId}</span> },
    { key: 'quantity', label: 'Kuantitas Tersedia', render: (item: any) => <span className="font-bold text-slate-800">{item.availableQuantity}</span> },
    { key: 'reservedQuantity', label: 'Dipesan / Tertahan', render: (item: any) => <span className="text-slate-600">{item.reservedQuantity}</span> },
    { key: 'accountType', label: 'Tipe Pemilik', render: (item: any) => <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-bold">{item.accountType}</span> },
    { key: 'updatedAt', label: 'Terakhir Update', render: (item: any) => <span className="text-slate-600">{new Date(item.updatedAt).toLocaleString('id-ID')}</span> },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Layers size={24} className="text-emerald-600" />
            Gudang Inventaris
          </h1>
          <p className="text-slate-500 text-sm mt-1">Pantau sisa stok dan kuantitas batch Anda.</p>
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
      />
    </div>
  );
};

export default Inventories;
