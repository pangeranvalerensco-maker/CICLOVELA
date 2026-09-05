import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Search, MapPin } from 'lucide-react';
import { businessApi } from '../api/endpoints';

const Partners = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    businessApi.getAll({ page: 0, size: 20, search, verificationStatus: 'APPROVED' })
      .then((res: any) => setData(res.data?.data?.content ?? []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="text-emerald-600" /> {t('partners.title')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">{t('partners.subtitle')}</p>
        
        <div className="relative max-w-md mt-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('partners.search')}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-900 dark:text-white"
          />
        </div>

        {loading ? (
          <p className="mt-8 text-slate-400">{t('catalog.loading')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {data.map((b: any) => (
              <div key={b.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-lg">
                    {b.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-tight">{b.name}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-md inline-block mt-1">
                      {b.businessType === 'DISTRIBUTOR' ? t('partners.type_distributor') : t('partners.type_retailer')}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <p className="flex items-start gap-2">
                    <MapPin size={16} className="shrink-0 mt-0.5 text-slate-400" />
                    <span>{b.city}, {b.province}</span>
                  </p>
                </div>
              </div>
            ))}
            {data.length === 0 && <p className="text-slate-400 col-span-3">Mitra tidak ditemukan.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Partners;
