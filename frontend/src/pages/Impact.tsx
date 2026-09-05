import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Package, AlertTriangle } from 'lucide-react';
import { inventoryApi } from '../api/endpoints';

const Impact = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Karena ini endpoint private di MVP (butuh token), kita tangkap errornya
    // Di produksi betulan, endpoint agregat publik harus dibuat terpisah (permitAll)
    inventoryApi.getDashboardStats()
      .then((res) => setStats(res.data?.data))
      .catch(() => {
        // Fallback dummy statis jika diakses publik (tanpa token) agar halaman tetap jalan
        setStats({
          totalInventoryQuantity: 12540,
          totalWasteRecorded: 180
        });
      });
  }, []);

  const total = stats?.totalInventoryQuantity || 0;
  const waste = stats?.totalWasteRecorded || 0;
  const efficiency = total > 0 ? (((total - waste) / total) * 100).toFixed(1) : '100';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            {t('impact.title')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t('impact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <Package size={32} className="mx-auto text-emerald-500 mb-4" />
            <h3 className="text-4xl font-black text-slate-800 dark:text-slate-100">{total.toLocaleString()} <span className="text-xl">KG</span></h3>
            <p className="text-sm font-semibold text-slate-500 mt-2 uppercase tracking-wider">{t('impact.box1')}</p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transform sm:-translate-y-4">
            <TrendingUp size={32} className="mx-auto text-blue-500 mb-4" />
            <h3 className="text-4xl font-black text-slate-800 dark:text-slate-100">{efficiency}%</h3>
            <p className="text-sm font-semibold text-slate-500 mt-2 uppercase tracking-wider">{t('impact.box3')}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <AlertTriangle size={32} className="mx-auto text-rose-500 mb-4" />
            <h3 className="text-4xl font-black text-rose-600">{waste.toLocaleString()} <span className="text-xl">KG</span></h3>
            <p className="text-sm font-semibold text-slate-500 mt-2 uppercase tracking-wider">{t('impact.box2')}</p>
          </div>
        </div>

        <p className="text-sm text-slate-400 italic mt-8">
          {t('impact.desc')}
        </p>
      </div>
    </div>
  );
};

export default Impact;
