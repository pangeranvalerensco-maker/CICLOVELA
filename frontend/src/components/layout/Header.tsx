import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Menu, Globe, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { purchaseApi, saleApi } from '../../api/endpoints';

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<{ title: string; path: string }[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) return;
      const list: { title: string; path: string }[] = [];
      try {
        if (user.role === 'FARMER') {
          const res = await purchaseApi.getAll({ page: 0, size: 5, status: 'PENDING', sellerFarmerId: user.id });
          const count = res.data?.data?.totalElements || 0;
          if (count > 0) list.push({ title: `${count} pesanan distributor menunggu konfirmasi`, path: '/transactions/purchases' });
        } else {
          const purchases = await purchaseApi.getAll({ page: 0, size: 5, status: 'CONFIRMED' }).catch(() => null);
          const sales = await saleApi.getAll({ page: 0, size: 5, status: 'PENDING' }).catch(() => null);
          const purchaseCount = purchases?.data?.data?.totalElements || 0;
          const saleCount = sales?.data?.data?.totalElements || 0;
          if (purchaseCount > 0) list.push({ title: `${purchaseCount} pembelian siap diselesaikan`, path: '/transactions/purchases' });
          if (saleCount > 0) list.push({ title: `${saleCount} penjualan menunggu konfirmasi`, path: '/transactions/sales' });
        }
      } finally {
        setNotifications(list);
      }
    };
    loadNotifications();
  }, [user]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'id' ? 'en' : 'id';
    i18n.changeLanguage(newLang);
  };

  const formatRole = (role?: string) => {
    if (!role) return '';
    if (role === 'PLATFORM_ADMIN') return 'Administrator';
    if (role === 'FARMER') return i18n.language === 'id' ? 'Petani' : 'Farmer';
    return i18n.language === 'id' ? 'Pelaku Bisnis' : 'Business Actor';
  };

  return (
    <header className="bg-white dark:bg-slate-900 h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm border-b border-gray-200 dark:border-slate-700 z-10">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors" aria-label="Buka menu">
          <Menu size={20} />
        </button>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Language Toggle */}
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 p-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
          title="Ganti Bahasa / Change Language"
        >
          <Globe size={18} />
          <span>{i18n.language === 'en' ? 'EN' : 'ID'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-full transition-colors"
          title={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative ml-2">
          <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 text-gray-500 dark:text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-full transition-colors">
            <Bell size={20} />
            {notifications.length > 0 && <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">{notifications.length}</span>}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 font-bold text-sm text-slate-800 dark:text-slate-100">Notifikasi</div>
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-sm text-slate-500 dark:text-slate-400 text-center">Tidak ada notifikasi baru</div>
              ) : notifications.map((item, idx) => (
                <button key={idx} onClick={() => { window.location.href = item.path; }} className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  {item.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 hidden sm:block"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="hidden md:flex flex-col items-end">
            <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 group-hover:text-emerald-600 transition-colors leading-none mb-1">
              {user?.name}
            </p>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700">
              {formatRole(user?.role)}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-semibold shadow-sm border-2 border-white dark:border-slate-900 ring-2 ring-gray-100 dark:ring-slate-700">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
