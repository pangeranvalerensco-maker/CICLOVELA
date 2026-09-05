import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tractor, Globe, Sun, Moon, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

const PublicNav = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const anchors = [
    { href: '/#about', label: t('nav.about') },
    { href: '/#features', label: t('nav.features') },
    { href: '/#how-it-works', label: t('nav.how') },
    { href: '/#faq', label: t('nav.faq') },
  ];
  const pages = [
    { to: '/catalog', label: t('nav.catalog') },
    { to: '/partners', label: t('nav.partners') },
    { to: '/impact', label: t('nav.impact') },
    { to: '/traceability', label: t('nav.trace') },
  ];

  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 md:gap-3" title="Kembali ke beranda">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Tractor className="text-white" size={20} />
          </div>
          <span className="font-black text-slate-900 dark:text-white text-base md:text-xl tracking-tight">CICLOVELA</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {anchors.map((a) => (
            <a key={a.href} href={a.href} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{a.label}</a>
          ))}
          {pages.map((p) => (
            <Link key={p.to} to={p.to} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{p.label}</Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'id' ? 'en' : 'id')}
            className="flex items-center gap-1 p-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 rounded-lg"
            title="Ganti Bahasa / Change Language"
          >
            <Globe size={18} />
            <span>{i18n.language === 'en' ? 'EN' : 'ID'}</span>
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 rounded-lg"
            title={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/login" className="text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 transition-colors ml-1">
            {t('nav.login')}
          </Link>
          <Link to="/register" className="bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md transition-all hover:-translate-y-0.5">
            {t('nav.register')}
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'id' ? 'en' : 'id')}
            className="p-2 text-sm font-bold text-slate-600 dark:text-slate-300 rounded-lg"
            title="Ganti Bahasa"
          >
            <Globe size={18} />
          </button>
          <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-300 rounded-lg" title="Tema">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="p-2 text-slate-600 dark:text-slate-300" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-3 shadow-lg absolute w-full left-0">
          {anchors.map((a) => (
            <a key={a.href} href={a.href} onClick={() => setOpen(false)} className="block text-base font-medium text-slate-700 dark:text-slate-200">{a.label}</a>
          ))}
          {pages.map((p) => (
            <Link key={p.to} to={p.to} onClick={() => setOpen(false)} className="block text-base font-medium text-slate-700 dark:text-slate-200">{p.label}</Link>
          ))}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <Link to="/login" onClick={() => setOpen(false)} className="w-full text-center py-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold rounded-lg">{t('nav.login')}</Link>
            <Link to="/register" onClick={() => setOpen(false)} className="w-full text-center py-2.5 bg-slate-900 dark:bg-emerald-600 text-white font-bold rounded-lg">{t('nav.register')}</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNav;
