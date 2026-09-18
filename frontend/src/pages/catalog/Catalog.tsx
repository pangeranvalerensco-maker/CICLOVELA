import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package } from 'lucide-react';
import { productApi } from '../../api/endpoints';

import { useTranslation } from 'react-i18next';

const Catalog = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    productApi.getAll({ page: 0, size: 12, search, status: 'ACTIVE' })
      .then((res) => setData(res.data?.data?.content ?? []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [search]);

  // Fungsi untuk mendapatkan gambar ilustrasi
  const getImageUrl = (product: any) => {
    if (product.imageUrl) {
      // Jika upload lewat API Gateway / Catalog Service, tambahkan localhost host-nya.
      if (product.imageUrl.startsWith('/api')) {
         return `http://localhost:8080${product.imageUrl}`;
      }
      return product.imageUrl;
    }

    const name = product.category?.name?.toLowerCase() || '';
    if (name.includes('buah')) return 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&q=80';
    if (name.includes('sayur') && name.includes('daun')) return 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80';
    if (name.includes('sayur')) return 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500&q=80';
    if (name.includes('umbi')) return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80';
    if (name.includes('rempah')) return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80';
    if (name.includes('biji')) return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80';
    return 'https://images.unsplash.com/photo-1595853035070-59a39fe84da3?w=500&q=80';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 w-full flex-1">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <Package className="text-emerald-600" /> {t('catalog.title')}
        </h1>
        <p className="text-slate-500 mt-2">{t('catalog.subtitle')}</p>
        <div className="relative max-w-md mt-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('catalog.search')}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        {loading ? (
          <p className="mt-8 text-slate-400">{t('catalog.loading')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {data.map((p: any) => (
              <button 
                key={p.id} 
                onClick={() => navigate(`/catalog/${p.id}`)}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all group flex flex-col text-left cursor-pointer w-full"
              >
                <div className="h-48 w-full overflow-hidden relative">
                  <img src={getImageUrl(p)} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-5 right-5 font-extrabold text-white text-xl leading-tight">{p.name}</h3>
                </div>
                <div className="p-5 flex-1 flex flex-col w-full">
                  <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md w-max mb-3">
                    {p.category?.name} • {p.unit}
                  </p>
                  {p.description && <p className="text-sm text-slate-600 line-clamp-2 flex-1">{p.description}</p>}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 w-full">
                    <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">
                      {t('catalog.detail')}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate('/traceability'); }} 
                      className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      {t('catalog.trace')}
                    </button>
                  </div>
                </div>
              </button>
            ))}
            {data.length === 0 && <p className="text-slate-400">Tidak ada produk aktif.</p>}
          </div>
        )}
      </div>
  );
};

export default Catalog;


