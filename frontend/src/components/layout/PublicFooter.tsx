import { Link } from 'react-router-dom';
import { Tractor } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PublicFooter = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-950 pt-14 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-5" title="Kembali ke beranda">
              <Tractor className="text-emerald-500" size={26} />
              <span className="text-xl font-black tracking-tight text-white">CICLOVELA</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {t('landing.footerDesc')}
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">{t('landing.footerLinks')}</h4>
            <ul className="space-y-3">
              <li><Link to="/catalog" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">{t('nav.catalog')}</Link></li>
              <li><Link to="/traceability" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">{t('nav.trace')}</Link></li>
              <li><Link to="/login" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">{t('nav.login')}</Link></li>
              <li><Link to="/register" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">{t('nav.register')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">{t('landing.footerLegal')}</h4>
            <ul className="space-y-3">
              <li><Link to="/terms" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Syarat &amp; Ketentuan</Link></li>
              <li><Link to="/privacy" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Kebijakan Privasi</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Hubungi Kami</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800/80 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
          <p className="text-slate-500 text-sm">
            &copy; 2026 CICLOVELA Platform.
          </p>
          <p className="text-slate-500 text-sm">
            {t('landing.footerMade')} <span className="font-semibold text-slate-300">Pangeran Valerensco Rivaldi Hutabarat</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
