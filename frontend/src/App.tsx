import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PrivateRoute, RoleRoute } from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Layout from './components/layout/Layout';
import PublicLayout from './components/layout/PublicLayout';
import Products from './pages/products/Products';
import Batches from './pages/batches/Batches';
import Inventories from './pages/inventories/Inventories';
import Purchases from './pages/transactions/Purchases';
import Sales from './pages/transactions/Sales';
import Waste from './pages/waste/Waste';
import Traceability from './pages/traceability/Traceability';
import BusinessProfile from './pages/business/BusinessProfile';

import Dashboard from './pages/dashboard/Dashboard';
import Landing from './pages/Landing';
import PageTitle from './components/PageTitle';

import Categories from './pages/admin/Categories';
import Entities from './pages/admin/Entities';
import Users from './pages/admin/Users';
import Catalog from './pages/catalog/Catalog';
import CatalogDetail from './pages/catalog/CatalogDetail';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Partners from './pages/Partners';
import Impact from './pages/Impact';
import Settings from './pages/settings/Settings';
import Help from './pages/help/Help';

const NotFound = () => <div className="min-h-screen flex items-center justify-center text-gray-500 text-2xl">404 - Halaman Tidak Ditemukan</div>;
const Forbidden = () => <div className="min-h-screen flex items-center justify-center text-red-600 text-2xl">403 - Akses Ditolak</div>;

function AppRoutes() {
  return (
    <>
      <PageTitle />
      <Routes>
      {/* Public Routes dengan header/footer seragam */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:id" element={<CatalogDetail />} />
        <Route path="/traceability" element={<Traceability />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Private Routes dengan Layout Utama */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Admin Routes */}
          <Route element={<RoleRoute allowedRoles={['PLATFORM_ADMIN']} />}>
            <Route path="/admin/entities" element={<Entities />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/categories" element={<Categories />} />
          </Route>
          
          {/* Other Feature Routes */}
          <Route path="/products" element={<Products />} />
          <Route path="/batches" element={<Batches />} />
          <Route path="/inventories" element={<Inventories />} />
          <Route path="/business" element={<BusinessProfile />} />
          <Route path="/transactions/purchases" element={<Purchases />} />
          <Route path="/transactions/sales" element={<Sales />} />
          <Route path="/waste" element={<Waste />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
        </Route>
      </Route>

      {/* Error Pages */}
      <Route path="/403" element={<Forbidden />} />
      <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

