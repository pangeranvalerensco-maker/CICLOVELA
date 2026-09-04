import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, Building2, Users, Package, Layers, 
  ShoppingCart, ArrowRightLeft, Trash2, Tractor, Store,
  LogOut, Settings, HelpCircle
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  
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
        { to: '/transactions/sales', icon: <ArrowRightLeft size={18} />, label: t('sidebar.sales') },
        { to: '/waste', icon: <Trash2 size={18} />, label: t('sidebar.waste') }
      );
    }

    if (role === 'CONSUMER') {
      links.push(
        { to: '/business', icon: <Building2 size={18} />, label: t('sidebar.business_profile') },
        { to: '/inventories', icon: <Layers size={18} />, label: t('sidebar.inventory') },
        { to: '/transactions/purchases', icon: <ShoppingCart size={18} />, label: t('sidebar.purchases') },
        { to: '/transactions/sales', icon: <Store size={18} />, label: t('sidebar.sales') },
        { to: '/waste', icon: <Trash2 size={18} />, label: t('sidebar.waste') },
        { to: '/traceability', icon: <ArrowRightLeft size={18} />, label: t('sidebar.traceability') }
      );
    }

    return links;
  };

  return (
    <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col h-full shrink-0 shadow-xl z-20 relative">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 bg-[#0b1120] border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Tractor size={20} className="text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-wide text-white">CICLOVELA</h1>
        </div>
      </div>

      {/* User Info Quick View */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <span className="text-sm font-semibold text-emerald-400">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-white truncate">{user.name}</span>
            <span className="text-xs text-slate-500 truncate">{user.email}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <div className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          {t('sidebar.main_menu')}
        </div>
        <nav className="space-y-1 px-3">
          {getNavLinks().map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 border border-transparent'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg transition-colors text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100 mb-1">
          <Settings size={18} />
          {t('sidebar.settings')}
        </button>
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg transition-colors text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100 mb-4">
          <HelpCircle size={18} />
          {t('sidebar.help')}
        </button>
        <button 
          onClick={logout}
          className="flex items-center justify-center gap-2 px-3 py-2.5 w-full rounded-lg transition-colors text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
        >
          <LogOut size={16} />
          {t('sidebar.logout')}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
