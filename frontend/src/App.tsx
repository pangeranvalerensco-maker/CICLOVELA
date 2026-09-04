import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, RoleRoute } from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Layout from './components/layout/Layout';
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

import Categories from './pages/admin/Categories';
import Entities from './pages/admin/Entities';

const NotFound = () => <div className="min-h-screen flex items-center justify-center text-gray-500 text-2xl">404 - Halaman Tidak Ditemukan</div>;
const Forbidden = () => <div className="min-h-screen flex items-center justify-center text-red-600 text-2xl">403 - Akses Ditolak</div>;

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Private Routes dengan Layout Utama */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Admin Routes */}
          <Route element={<RoleRoute allowedRoles={['PLATFORM_ADMIN']} />}>
            <Route path="/admin/entities" element={<Entities />} />
            <Route path="/admin/users" element={<div>Manajemen Pengguna (WIP)</div>} />
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
          <Route path="/traceability" element={<Traceability />} />
        </Route>
      </Route>

      {/* Error Pages */}
      <Route path="/403" element={<Forbidden />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

