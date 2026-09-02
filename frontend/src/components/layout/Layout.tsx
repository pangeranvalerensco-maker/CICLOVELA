import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden font-sans">
      <Sidebar />

      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header />

        {/* Area utama dengan scroll */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
