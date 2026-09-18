import { useAuth } from '../../context/AuthContext';
import { 
  Tractor, Package, ArrowUpRight, ArrowDownRight, 
  TrendingUp, AlertTriangle, CheckCircle2,
  AlertOctagon, Users, Building2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { inventoryApi, userApi, businessApi, membershipApi } from '../../api/endpoints';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [liveStats, setLiveStats] = useState<any>(null);
  const [adminStats, setAdminStats] = useState({ users: 0, entities: 0 });
  const [hasBusiness, setHasBusiness] = useState<boolean | null>(null);

  useEffect(() => {
    if (user?.role === 'PLATFORM_ADMIN') {
      setHasBusiness(false);
      Promise.all([
        userApi.getAll({ size: 1 }).catch(() => null),
        businessApi.getAll({ size: 1 }).catch(() => null)
      ]).then(([usersRes, entitiesRes]) => {
        setAdminStats({
          users: usersRes?.data?.data?.totalElements || 0,
          entities: entitiesRes?.data?.data?.totalElements || 0
        });
      });
    } else {
      if (user?.role === 'CONSUMER') {
        membershipApi.getMine()
          .then(res => {
            const has = res.data?.data?.length > 0;
            setHasBusiness(has);
            if (has) {
              inventoryApi.getDashboardStats()
                .then((res) => setLiveStats(res.data?.data))
                .catch(() => setLiveStats(null));
            }
          })
          .catch(() => setHasBusiness(false));
      } else {
        setHasBusiness(true);
        inventoryApi.getDashboardStats()
          .then((res) => setLiveStats(res.data?.data))
          .catch(() => setLiveStats(null));
      }
    }
  }, [user]);

  const stats = [
    { title: t('dashboard.total_inventory'), value: liveStats ? `${liveStats.totalInventoryQuantity} KG` : '0 KG', change: '+12.5%', isUp: true, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: t('dashboard.inbound'), value: liveStats ? `${liveStats.inboundTransactions}` : '0', change: '+4.2%', isUp: true, icon: ArrowDownRight, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: t('dashboard.outbound'), value: liveStats ? `${liveStats.outboundTransactions}` : '0', change: '-2.4%', isUp: false, icon: ArrowUpRight, color: 'text-violet-600', bg: 'bg-violet-100' },
    { title: t('dashboard.waste'), value: liveStats ? `${liveStats.totalWasteRecorded} KG` : '0 KG', change: '-18.1%', isUp: true, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  const getActivityIcon = (eventType: string) => {
    if (eventType === 'WASTE_OUT') return AlertTriangle;
    if (eventType === 'SALE_OUT' || eventType === 'TRANSFER_OUT') return ArrowUpRight;
    if (eventType === 'PURCHASE_IN' || eventType === 'TRANSFER_IN' || eventType === 'ADJUSTMENT_IN') return CheckCircle2;
    return Tractor;
  };

  const recentActivities = (liveStats?.recentActivities || []).map((activity: any) => ({
    ...activity,
    icon: getActivityIcon(activity.eventType || ''),
  }));

  const chartData = liveStats?.inventoryTrend || [];
  const expiringBatches = liveStats?.expiringBatches || [];

  const isAdmin = user?.role === 'PLATFORM_ADMIN';
  const isPureConsumer = user?.role === 'CONSUMER' && hasBusiness === false;

  if (hasBusiness === null && !isAdmin) {
    return <div className="p-8 text-center text-slate-500">{t('dashboard.loading')}</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('sidebar.dashboard')}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {t('dashboard.welcome')} {user?.name}, {isAdmin ? t('dashboard.admin_subtitle') : t('dashboard.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm font-medium">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">{t('dashboard.admin_users')}</p>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">{adminStats.users}</h2>
            </div>
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
              <Users size={28} />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">{t('dashboard.admin_entities')}</p>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">{adminStats.entities}</h2>
            </div>
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
              <Building2 size={28} />
            </div>
          </div>
        </div>
      )}

      {isPureConsumer && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-8 text-center max-w-2xl mx-auto mt-10">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">{t('dashboard.consumer_title')}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">{t('dashboard.consumer_text')}</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => window.location.href='/traceability'} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors">{t('dashboard.track_btn')}</button>
            <button onClick={() => window.location.href='/business'} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold transition-colors">{t('dashboard.register_btn')}</button>
          </div>
        </div>
      )}

      {!isAdmin && !isPureConsumer && (
        <>
          {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 hover:shadow-md transition-shadow">
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
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Layout Split Tengah */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART AREA */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">{t('dashboard.inventory_trend')}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('dashboard.chart_sub')}</p>
              </div>
              <select className="text-sm border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 focus:ring-emerald-500 focus:border-emerald-500 outline-none p-2 border cursor-pointer bg-slate-50 dark:bg-slate-800">
                <option>{t('dashboard.period_week')}</option>
                <option>{t('dashboard.period_month')}</option>
              </select>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#e2e8f0' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Bar dataKey="masuk" name={t('dashboard.inbound_label')} fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="keluar" name={t('dashboard.outbound_label')} fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Area Chart - Limbah */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">{t('dashboard.waste_trend')}</h2>
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
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#e2e8f0' }} />
                  <Area type="monotone" dataKey="limbah" name={t('dashboard.waste_label')} stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorLimbah)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* SIDE AREA (Kanan) */}
        <div className="space-y-6">
          
          {/* Warning Card */}
          <div className="bg-rose-50 dark:bg-rose-500/10 rounded-xl border border-rose-200 dark:border-rose-500/20 shadow-sm p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <AlertOctagon size={100} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 mb-4">
                <AlertTriangle size={20} />
                <h2 className="text-sm font-bold uppercase tracking-wide">{t('dashboard.expiry_warning')}</h2>
              </div>
              <div className="space-y-3">
                {expiringBatches.length === 0 ? (
                  <p className="text-sm text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-800/70 border border-rose-100 dark:border-rose-500/20 rounded-lg px-3 py-4 text-center">
                    {t('dashboard.no_expiry')}
                  </p>
                ) : expiringBatches.map((b: any) => (
                  <div key={b.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg border border-rose-100 dark:border-rose-500/20 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{b.product}</p>
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400">{b.id} • {b.qty}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-bold rounded">
                        {t('dashboard.days_left', { days: b.daysLeft })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => window.location.href='/inventories'} className="w-full mt-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-colors uppercase tracking-wider">
                {t('dashboard.view_warehouse')}
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-6">{t('dashboard.recent_activity')}</h2>
            <div className="space-y-6">
              {recentActivities.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">{t('dashboard.no_activity')}</p>
              ) : recentActivities.map((activity: any) => {
                const ActivityIcon = activity.icon || Tractor;
                return (
                  <div key={activity.id} className="flex gap-4 relative">
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 ring-1 ring-slate-100 dark:ring-slate-700 shadow-sm ${
                        activity.status === 'success' ? 'bg-emerald-100 text-emerald-600' :
                        activity.status === 'warning' ? 'bg-rose-100 text-rose-600' :
                        'bg-violet-100 text-violet-600'
                      }`}>
                        <ActivityIcon size={14} />
                      </div>
                    </div>
                    <div className="flex-1 pb-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight mb-1">{activity.action}</p>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{activity.target}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {activity.time ? new Date(activity.time).toLocaleString('id-ID') : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => window.location.href='/transactions/purchases'} className="w-full mt-6 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              {t('dashboard.load_more')}
            </button>
          </div>

        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default Dashboard;
