import { useAuth } from '../../context/AuthContext';
import { Bell, Search, Menu } from 'lucide-react';

const Header = () => {
  const { user } = useAuth();

  const formatRole = (role?: string) => {
    if (!role) return '';
    if (role === 'PLATFORM_ADMIN') return 'Administrator';
    if (role === 'FARMER') return 'Petani';
    return 'Pelaku Bisnis';
  };

  return (
    <header className="bg-white h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm border-b border-gray-200 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu button (placeholder for responsive) */}
        <button className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Menu size={20} />
        </button>
        
        {/* Search Bar */}
        <div className="hidden sm:flex items-center bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all w-64 md:w-80">
          <Search size={16} className="text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Cari transaksi, batch, dll..." 
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="hidden md:flex flex-col items-end">
            <p className="text-sm font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors leading-none mb-1">
              {user?.name}
            </p>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
              {formatRole(user?.role)}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-semibold shadow-sm border-2 border-white ring-2 ring-gray-100">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
