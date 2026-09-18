import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tractor, Globe, Sun, Moon, Menu, X, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const PublicNav = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          {/* Dropdown Jelajahi/Explore */}
          <div 
            className="relative group py-4"
          >
            <button className="flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              {t('nav.explore', 'Jelajahi')} <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute top-full left-0 mt-0 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0 overflow-hidden">
              {anchors.map((a) => (
                <a key={a.href} href={a.href} className="block px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400">
                  {a.label}
                </a>
              ))}
              <div className="my-1 border-t border-slate-100 dark:border-slate-700"></div>
              {pages.filter(p => p.to === '/partners' || p.to === '/impact').map((p) => (
                <Link key={p.to} to={p.to} className="block px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400">
                  {p.label}
                </Link>
              ))}
            </div>
          </div>

          {pages.filter(p => p.to === '/catalog' || p.to === '/traceability').map((p) => (
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
          
          {user ? (
            <div className="relative ml-2" ref={userMenuRef}>
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 hidden lg:block">{user.name}</span>
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 py-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  </div>
                  <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors text-left mt-1">
                    <LogOut size={16} /> Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 transition-colors ml-1">
                {t('nav.login')}
              </Link>
              <Link to="/register" className="whitespace-nowrap bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md transition-all hover:-translate-y-0.5">
                {t('nav.register')}
              </Link>
            </>
          )}
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
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold rounded-lg"><LayoutDashboard size={18} /> Dashboard</Link>
                <button onClick={() => { logout(); setOpen(false); }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 font-bold rounded-lg"><LogOut size={18} /> Keluar</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="w-full text-center py-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold rounded-lg">{t('nav.login')}</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="w-full text-center py-2.5 bg-slate-900 dark:bg-emerald-600 text-white font-bold rounded-lg">{t('nav.register')}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNav;
