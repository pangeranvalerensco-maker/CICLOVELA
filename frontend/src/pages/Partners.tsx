import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Search, MapPin, Mail, Phone } from 'lucide-react';
import { businessApi } from '../api/endpoints';
import Modal from '../components/ui/Modal';

const Partners = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);

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
              <button 
                key={b.id} 
                onClick={() => setSelectedPartner(b)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700 transition-all text-left flex flex-col h-full cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-lg shrink-0">
                    {b.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-tight">{b.name}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-md inline-block mt-1">
                      {b.businessType === 'DISTRIBUTOR' ? t('partners.type_distributor') : t('partners.type_retailer')}
                    </span>
                  </div>
                </div>
                
                <div className="mt-auto space-y-2 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <p className="flex items-start gap-2">
                    <MapPin size={16} className="shrink-0 mt-0.5 text-slate-400" />
                    <span>{b.city}, {b.province}</span>
                  </p>
                </div>
              </button>
            ))}
            {data.length === 0 && <p className="text-slate-400 col-span-3">Mitra tidak ditemukan.</p>}
          </div>
        )}
      </div>

      <Modal isOpen={!!selectedPartner} onClose={() => setSelectedPartner(null)} title="Profil Mitra Bisnis">
        {selectedPartner && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-2xl shrink-0">
                {selectedPartner.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{selectedPartner.name}</h3>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  {selectedPartner.businessType === 'DISTRIBUTOR' ? t('partners.type_distributor') : t('partners.type_retailer')}
                  {selectedPartner.legalName && ` • ${selectedPartner.legalName}`}
                </p>
              </div>
            </div>

            {selectedPartner.description && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tentang Perusahaan</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  {selectedPartner.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kontak</h4>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  {selectedPartner.email && (
                    <li className="flex items-center gap-2">
                      <Mail size={16} className="text-slate-400" /> {selectedPartner.email}
                    </li>
                  )}
                  {selectedPartner.phone && (
                    <li className="flex items-center gap-2">
                      <Phone size={16} className="text-slate-400" /> {selectedPartner.phone}
                    </li>
                  )}
                </ul>
              </div>
              
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Lokasi</h4>
                <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <p>
                    {selectedPartner.address}<br/>
                    {selectedPartner.city}, {selectedPartner.province}<br/>
                    {selectedPartner.postalCode}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button onClick={() => setSelectedPartner(null)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-sm font-bold rounded-xl transition-colors">
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Partners;

