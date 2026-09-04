import { useAuth } from '../../context/AuthContext';
import { 
  Tractor, Package, ArrowUpRight, ArrowDownRight, 
  TrendingUp, Clock, AlertTriangle, CheckCircle2,
  AlertOctagon
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  // Data Dummy Statistik (Di dunia nyata ambil dari API backend)
  const stats = [
    { title: t('dashboard.total_inventory'), value: '2,450 KG', change: '+12.5%', isUp: true, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: t('dashboard.inbound'), value: '18', change: '+4.2%', isUp: true, icon: ArrowDownRight, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: t('dashboard.outbound'), value: '24', change: '-2.4%', isUp: false, icon: ArrowUpRight, color: 'text-violet-600', bg: 'bg-violet-100' },
    { title: t('dashboard.waste'), value: '12 KG', change: '-18.1%', isUp: true, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  const recentActivities = [
    { id: 1, action: 'Pembelian Selesai (B2B)', target: 'Tomat Cherry (50 KG)', time: '2 jam yang lalu', status: 'success', icon: CheckCircle2 },
    { id: 2, action: 'Pencatatan Limbah', target: 'Wortel (5 KG) - Busuk', time: '5 jam yang lalu', status: 'warning', icon: AlertTriangle },
    { id: 3, action: 'Penjualan ke Konsumen', target: 'Cabai Merah (20 KG)', time: '1 hari yang lalu', status: 'info', icon: ArrowUpRight },
    { id: 4, action: 'Batch Baru Terdaftar', target: 'Bawang Merah (100 KG)', time: '2 hari yang lalu', status: 'success', icon: Tractor },
  ];

  const chartData = [
    { name: 'Sen', masuk: 400, keluar: 240, limbah: 20 },
    { name: 'Sel', masuk: 300, keluar: 139, limbah: 15 },
    { name: 'Rab', masuk: 200, keluar: 880, limbah: 40 },
    { name: 'Kam', masuk: 278, keluar: 390, limbah: 10 },
    { name: 'Jum', masuk: 189, keluar: 480, limbah: 5 },
    { name: 'Sab', masuk: 239, keluar: 380, limbah: 25 },
    { name: 'Min', masuk: 349, keluar: 430, limbah: 30 },
  ];

  const expiringBatches = [
    { id: 'B-098', product: 'Tomat Segar', daysLeft: 2, qty: '150 KG' },
    { id: 'B-102', product: 'Cabai Hijau', daysLeft: 3, qty: '45 KG' },
    { id: 'B-045', product: 'Bawang Putih', daysLeft: 5, qty: '200 KG' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('sidebar.dashboard')}</h1>
          <p className="text-slate-500 text-sm mt-1">
            {t('dashboard.welcome')} {user?.name}, {t('dashboard.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm font-medium">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
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

      {/* Layout Split Tengah */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART AREA */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Chart */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-800">{t('dashboard.inventory_trend')}</h2>
                <p className="text-xs text-slate-500 mt-1">Data 7 Hari Terakhir (Dalam KG)</p>
              </div>
              <select className="text-sm border-slate-200 rounded-lg text-slate-600 focus:ring-emerald-500 focus:border-emerald-500 outline-none p-2 border cursor-pointer bg-slate-50">
                <option>Minggu Ini</option>
                <option>Bulan Ini</option>
              </select>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Bar dataKey="masuk" name="Inbound (Masuk)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="keluar" name="Outbound (Keluar)" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Area Chart - Limbah */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-base font-bold text-slate-800">{t('dashboard.waste_trend')}</h2>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLimbah" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="limbah" name="Limbah (KG)" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorLimbah)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* SIDE AREA (Kanan) */}
        <div className="space-y-6">
          
          {/* Warning Card */}
          <div className="bg-rose-50 rounded-xl border border-rose-200 shadow-sm p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <AlertOctagon size={100} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-rose-700 mb-4">
                <AlertTriangle size={20} />
                <h2 className="text-sm font-bold uppercase tracking-wide">{t('dashboard.expiry_warning')}</h2>
              </div>
              <div className="space-y-3">
                {expiringBatches.map((b) => (
                  <div key={b.id} className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-rose-100 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{b.product}</p>
                      <p className="text-xs font-mono text-slate-500">{b.id} • {b.qty}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded">
                        Sisa {b.daysLeft} Hari
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors uppercase tracking-wider">
                Lihat Seluruh Gudang →
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-800 mb-6">{t('dashboard.recent_activity')}</h2>
            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-4 relative">
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white ring-1 ring-slate-100 shadow-sm ${
                      activity.status === 'success' ? 'bg-emerald-100 text-emerald-600' :
                      activity.status === 'warning' ? 'bg-rose-100 text-rose-600' :
                      'bg-violet-100 text-violet-600'
                    }`}>
                      <activity.icon size={14} />
                    </div>
                  </div>
                  <div className="flex-1 pb-2 border-b border-slate-100 last:border-0">
                    <p className="text-sm font-bold text-slate-800 leading-tight mb-1">{activity.action}</p>
                    <p className="text-xs font-medium text-slate-600 mb-1">{activity.target}</p>
                    <p className="text-xs text-slate-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2.5 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors">
              Muat Lebih Banyak
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
