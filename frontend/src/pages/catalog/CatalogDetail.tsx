import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin } from 'lucide-react';
import { productApi } from '../../api/endpoints';

const CatalogDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productApi.getById(id)
      .then((res) => setData(res.data?.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const getImageUrl = (product: any) => {
    if (!product) return '';
    if (product.imageUrl) {
      if (product.imageUrl.startsWith('/api')) return `http://localhost:8080${product.imageUrl}`;
      return product.imageUrl;
    }
    const name = product.category?.name?.toLowerCase() || '';
    if (name.includes('buah')) return 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1000&q=80';
    if (name.includes('sayur') && name.includes('daun')) return 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=1000&q=80';
    if (name.includes('sayur')) return 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=1000&q=80';
    if (name.includes('umbi')) return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=1000&q=80';
    if (name.includes('rempah')) return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1000&q=80';
    if (name.includes('biji')) return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1000&q=80';
    return 'https://images.unsplash.com/photo-1595853035070-59a39fe84da3?w=1000&q=80';
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full flex-1">
      <Link to="/catalog" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800">
        <ArrowLeft size={16} /> {t('catalog.back')}
      </Link>

      {loading ? (
        <p className="mt-8 text-slate-400">{t('catalog.loading')}</p>
      ) : notFound || !data ? (
        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <p className="font-bold text-slate-800">{t('catalog.not_found')}</p>
          <p className="text-sm text-slate-500 mt-1">{t('catalog.not_found_desc')}</p>
        </div>
      ) : (
        <div className="mt-6 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="h-64 w-full relative">
            <img src={getImageUrl(data)} alt={data.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-md mb-3 inline-block">
                  {data.category?.name}
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-white">{data.name}</h1>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center border border-white/30 hidden sm:block">
                <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">{t('catalog.unit')}</p>
                <p className="text-white font-black text-xl">{data.unit}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 sm:p-8">
            {data.description && (
              <p className="text-slate-600 text-lg leading-relaxed">{data.description}</p>
            )}

            <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('catalog.sku')}</dt>
                <dd className="font-mono font-bold text-slate-800 text-lg mt-1">{data.sku || '-'}</dd>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('catalog.shelf_life')}</dt>
                <dd className="font-bold text-slate-800 text-lg mt-1">{data.shelfLifeDays ? `${data.shelfLifeDays} ${t('catalog.days')}` : '-'}</dd>
              </div>
            </dl>

            <div className="mt-10 flex justify-center">
              <Link
                to="/traceability"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-xl transition-all hover:-translate-y-0.5"
              >
                <MapPin size={18} className="text-emerald-400" /> {t('catalog.check_trace')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogDetail;
