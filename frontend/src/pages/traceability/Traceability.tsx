import { useState } from 'react';
import toast from 'react-hot-toast';
import { Search, MapPin, Calendar, Clock, Package, Tractor, AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3 } from 'lucide-react';
import { traceabilityApi } from '../../api/endpoints';

const Traceability = () => {
  const [batchCode, setBatchCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchCode.trim()) return;

    try {
      setLoading(true);
      setData(null);
      const res = await traceabilityApi.getByBatchCode(batchCode.trim());
      setData(res.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Data tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PURCHASE_IN':
      case 'TRANSFER_IN': 
        return <ArrowDownRight size={16} className="text-blue-600" />;
      case 'SALE_OUT':
      case 'TRANSFER_OUT': 
        return <ArrowUpRight size={16} className="text-emerald-600" />;
      case 'WASTE_OUT': 
        return <AlertTriangle size={16} className="text-rose-600" />;
      default: 
        return <Clock size={16} className="text-slate-600" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'PURCHASE_IN':
      case 'TRANSFER_IN': return 'bg-blue-100 ring-blue-50';
      case 'SALE_OUT':
      case 'TRANSFER_OUT': return 'bg-emerald-100 ring-emerald-50';
      case 'WASTE_OUT': return 'bg-rose-100 ring-rose-50';
      default: return 'bg-slate-100 ring-slate-50';
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
          <BarChart3 size={32} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Lacak Produk Anda</h1>
        <p className="text-slate-500 mt-2 max-w-xl mx-auto">
          Masukkan kode batch yang tertera pada kemasan produk untuk melihat perjalanan produk dari petani hingga ke tangan Anda.
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-12">
        <input
          type="text"
          value={batchCode}
          onChange={(e) => setBatchCode(e.target.value)}
          placeholder="Contoh: BATCH-001"
          className="w-full pl-6 pr-32 py-4 text-lg border-2 border-slate-200 rounded-full focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all shadow-sm font-mono font-bold text-slate-700"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="absolute right-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-full font-semibold transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {loading ? 'Mencari...' : <><Search size={20} /> Lacak</>}
        </button>
      </form>

      {data && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
          
          {/* Card Origin */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Tractor size={20} className="text-emerald-400" /> 
                Informasi Asal (Origin)
              </h2>
              <span className="px-3 py-1 bg-white/10 text-white text-xs font-mono rounded-full border border-white/20">
                {data.batchCode}
              </span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Produk</p>
                  <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Package size={20} className="text-emerald-600" /> {data.productName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Petani / Produsen</p>
                  <p className="text-base font-semibold text-slate-700 flex items-center gap-2">
                    <MapPin size={18} className="text-rose-500" /> {data.farmerName}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tanggal Panen & Kedaluwarsa</p>
                  <div className="flex items-center gap-4 text-sm font-medium text-slate-700">
                    <span className="flex items-center gap-1"><Calendar size={16} className="text-blue-500"/> {new Date(data.harvestDate).toLocaleDateString('id-ID')}</span>
                    <span className="text-slate-300">→</span>
                    <span className="flex items-center gap-1 text-rose-600"><AlertTriangle size={16}/> {new Date(data.expiryDate).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Kualitas & Kuantitas Awal</p>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded">Grade {data.qualityGrade}</span>
                    <span className="text-sm font-bold text-slate-700">{data.initialQuantity} {data.unit}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              Perjalanan Produk (Supply Chain)
            </h3>
            
            <div className="relative pl-4 md:pl-0">
              {/* Vertical line */}
              <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-slate-200 hidden md:block"></div>
              
              <div className="space-y-6">
                {/* Awal Panen */}
                <div className="relative flex items-start gap-4 md:gap-6">
                  <div className="hidden md:flex flex-col items-end w-32 shrink-0 pt-1">
                    <span className="text-sm font-bold text-slate-700">{new Date(data.harvestDate).toLocaleDateString('id-ID')}</span>
                    <span className="text-xs text-slate-500">Panen</span>
                  </div>
                  <div className="absolute md:relative left-0 md:left-auto w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-50 z-10 shrink-0 mt-1 md:mt-1.5 shadow-sm"></div>
                  <div className="flex-1 bg-white p-5 rounded-xl border border-slate-200 shadow-sm ml-6 md:ml-0">
                    <h4 className="font-bold text-slate-800">Produk Selesai Dipanen</h4>
                    <p className="text-sm text-slate-500 mt-1">Dicatat ke dalam sistem oleh {data.farmerName}</p>
                  </div>
                </div>

                {/* Looping dari tabel movements */}
                {data.timeline?.map((event: any, idx: number) => (
                  <div key={idx} className="relative flex items-start gap-4 md:gap-6">
                    <div className="hidden md:flex flex-col items-end w-32 shrink-0 pt-1">
                      <span className="text-sm font-bold text-slate-700">{new Date(event.timestamp).toLocaleDateString('id-ID')}</span>
                      <span className="text-xs text-slate-500">{new Date(event.timestamp).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className={`absolute md:relative left-[-2px] md:left-auto w-5 h-5 rounded-full ring-4 z-10 shrink-0 mt-0.5 md:mt-1 shadow-sm flex items-center justify-center ${getEventColor(event.eventType)}`}>
                      <div className="w-2 h-2 rounded-full bg-current opacity-70"></div>
                    </div>
                    <div className="flex-1 bg-white p-5 rounded-xl border border-slate-200 shadow-sm ml-6 md:ml-0 hover:border-blue-300 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                          {getEventIcon(event.eventType)}
                          {event.eventType.replace('_', ' ')}
                        </h4>
                        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          {event.quantity} {data.unit}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Traceability;
