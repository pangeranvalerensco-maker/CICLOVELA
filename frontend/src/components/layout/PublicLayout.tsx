import { Outlet, useLocation } from 'react-router-dom';
import PublicNav from './PublicNav';
import PublicFooter from './PublicFooter';

const PublicLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicNav />
      <div key={location.pathname + location.search} className="page-enter flex-1 flex flex-col">
        <Outlet />
      </div>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
