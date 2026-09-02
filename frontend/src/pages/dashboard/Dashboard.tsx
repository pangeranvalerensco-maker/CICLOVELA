import { useAuth } from '../../context/AuthContext';
import { 
  Tractor, Package, ArrowUpRight, ArrowDownRight, 
  TrendingUp, Clock, AlertTriangle, CheckCircle2, BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  // Ini hanya data statis sementara (placeholder)
  // Di tahap P1 kita akan ganti dengan data dari API
  const stats = [
    { title: 'Total Inventaris', value: '2,450 KG', change: '+12.5%', isUp: true, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Transaksi Masuk', value: '18', change: '+4.2%', isUp: true, icon: ArrowDownRight, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Transaksi Keluar', value: '24', change: '-2.4%', isUp: false, icon: ArrowUpRight, color: 'text-violet-600', bg: 'bg-violet-100' },
    { title: 'Limbah Tercatat', value: '12 KG', change: '-18.1%', isUp: true, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  const recentActivities = [
    { id: 1, action: 'Pembelian Selesai', target: 'Tomat Cherry (50 KG)', time: '2 jam yang lalu', status: 'success', icon: CheckCircle2 },
    { id: 2, action: 'Pencatatan Limbah', target: 'Wortel (5 KG) - Busuk', time: '5 jam yang lalu', status: 'warning', icon: AlertTriangle },
    { id: 3, action: 'Penjualan Baru', target: 'Cabai Merah (20 KG)', time: '1 hari yang lalu', status: 'info', icon: Clock },
    { id: 4, action: 'Batch Dipanen', target: 'Bawang Merah (100 KG)', time: '2 hari yang lalu', status: 'success', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Overview Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Selamat datang kembali {user?.name}, pantau aktivitas supply chain Anda hari ini.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-emerald-500/30 flex items-center gap-2">
            <Tractor size={16} />
            Transaksi Baru
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg}`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                stat.isUp ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
              }`}>
                {stat.isUp ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                {stat.change}
              </div>
            </div>
            <div>
              <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Activity Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placeholder Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-slate-800">Tren Pergerakan Inventaris</h2>
            <select className="text-sm border-slate-200 rounded-lg text-slate-600 focus:ring-emerald-500 focus:border-emerald-500 outline-none p-1.5 border cursor-pointer">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
              <option>Tahun Ini</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <div className="text-center">
              <BarChart3 size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">Grafik akan diimplementasikan pada fase P1</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-800 mb-6">Aktivitas Terbaru</h2>
          <div className="space-y-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-4 relative">
                <div className="relative z-10 flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white ring-1 ring-slate-100 shadow-sm ${
                    activity.status === 'success' ? 'bg-emerald-100 text-emerald-600' :
                    activity.status === 'warning' ? 'bg-rose-100 text-rose-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <activity.icon size={14} />
                  </div>
                </div>
                <div className="flex-1 pb-1 border-b border-slate-100 last:border-0">
                  <p className="text-sm font-semibold text-slate-800 leading-tight mb-1">{activity.action}</p>
                  <p className="text-xs text-slate-600 mb-1">{activity.target}</p>
                  <p className="text-xs text-slate-400 font-medium">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
            Lihat Semua Aktivitas
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
