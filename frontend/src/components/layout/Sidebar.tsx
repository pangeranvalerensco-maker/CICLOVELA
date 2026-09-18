import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, Building2, Users, Package, Layers, 
  ShoppingCart, ArrowRightLeft, Trash2, Tractor, Store,
  LogOut, Settings, HelpCircle
} from 'lucide-react';
import ConfirmDialog from '../ui/ConfirmDialog';
import { membershipApi } from '../../api/endpoints';

const Sidebar = ({ open = false, onClose }: { open?: boolean; onClose?: () => void }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [hasBusiness, setHasBusiness] = useState(false);
  
  useEffect(() => {
    if (user?.role === 'CONSUMER') {
      membershipApi.getMine().then(res => {
        setHasBusiness(res.data?.data?.length > 0);
      }).catch(() => {});
    }
  }, [user]);

  if (!user) return null;

  const role = user.role;

  const getNavLinks = () => {
    const links = [
      { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: t('sidebar.dashboard') }
    ];

    if (role === 'PLATFORM_ADMIN') {
      links.push(
        { to: '/admin/entities', icon: <Building2 size={18} />, label: t('sidebar.entities') },
        { to: '/admin/users', icon: <Users size={18} />, label: t('sidebar.users') },
        { to: '/admin/categories', icon: <Layers size={18} />, label: t('sidebar.categories') },
        { to: '/products', icon: <Package size={18} />, label: t('sidebar.all_products') },
      );
    }

    if (role === 'FARMER') {
      links.push(
        { to: '/products', icon: <Package size={18} />, label: t('sidebar.catalog') },
        { to: '/batches', icon: <Tractor size={18} />, label: t('sidebar.batches') },
        { to: '/inventories', icon: <Layers size={18} />, label: t('sidebar.inventory') },
        { to: '/transactions/purchases', icon: <ArrowRightLeft size={18} />, label: t('sidebar.sales') },
        { to: '/waste', icon: <Trash2 size={18} />, label: t('sidebar.waste') }
      );
    }

    if (role === 'CONSUMER') {
      links.push(
        { to: '/business', icon: <Building2 size={18} />, label: t('sidebar.business_profile') }
      );
      
      if (hasBusiness) {
        links.push(
          { to: '/inventories', icon: <Layers size={18} />, label: t('sidebar.inventory') },
          { to: '/transactions/purchases', icon: <ShoppingCart size={18} />, label: t('sidebar.purchases') },
          { to: '/transactions/sales', icon: <Store size={18} />, label: t('sidebar.sales') },
          { to: '/waste', icon: <Trash2 size={18} />, label: t('sidebar.waste') }
        );
      }
      
      links.push(
        { to: '/traceability', icon: <ArrowRightLeft size={18} />, label: t('sidebar.traceability') }
      );
    }

    return links;
  };

  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 bg-black/50 z-30 lg:hidden" />}
      <aside className={`w-64 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 flex flex-col h-full shrink-0 shadow-xl border-r border-slate-200 dark:border-slate-800 z-40 fixed lg:static inset-y-0 left-0 transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Brand Logo */}
        <div className="h-16 flex items-center px-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-3" title="Kembali ke beranda">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Tractor size={20} className="text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-wide text-slate-900 dark:text-white">CICLOVELA</h1>
          </Link>
        </div>

        {/* User Info Quick View */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</span>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {t('sidebar.main_menu')}
          </div>
          <nav className="space-y-1 px-3">
            {getNavLinks().map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `menu-item flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                    isActive 
                      ? 'active-menu-item bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 border dark:border-emerald-500/30 shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                  }`
                }
              >
                <span className="text-inherit">
                  {link.icon}
                </span>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Link to="/settings" onClick={onClose} className="menu-item flex items-center gap-3 px-3 py-2 w-full rounded-lg transition-colors text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-900 mb-1">
            <Settings size={18} />
            {t('sidebar.settings')}
          </Link>
          <Link to="/help" onClick={onClose} className="menu-item flex items-center gap-3 px-3 py-2 w-full rounded-lg transition-colors text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-900 mb-4">
            <HelpCircle size={18} />
            {t('sidebar.help')}
          </Link>
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center justify-center gap-2 px-3 py-2.5 w-full rounded-lg transition-colors text-sm font-medium bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20"
          >
            <LogOut size={16} />
            {t('sidebar.logout')}
          </button>
        </div>
      </aside>

      {/* Logout Confirmation */}
      <ConfirmDialog 
        isOpen={showLogoutConfirm}
        title="Konfirmasi Keluar"
        message="Apakah Anda yakin ingin keluar dari sesi aplikasi saat ini?"
        confirmText="Ya, Keluar"
        cancelText="Batal"
        isDestructive={true}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          logout();
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};

export default Sidebar;
