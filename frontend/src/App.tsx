import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, RoleRoute } from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Layout from './components/layout/Layout';

import Dashboard from './pages/dashboard/Dashboard';

const NotFound = () => <div className="min-h-screen flex items-center justify-center text-gray-500 text-2xl">404 - Halaman Tidak Ditemukan</div>;
const Forbidden = () => <div className="min-h-screen flex items-center justify-center text-red-600 text-2xl">403 - Akses Ditolak</div>;

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
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
            <Route path="/admin/entities" element={<div>Manajemen Entitas Bisnis</div>} />
            <Route path="/admin/users" element={<div>Manajemen Pengguna</div>} />
            <Route path="/admin/categories" element={<div>Kategori Produk</div>} />
          </Route>
          
          {/* Other Feature Routes - Placeholder for next days */}
          <Route path="/products" element={<div>Produk</div>} />
          <Route path="/batches" element={<div>Batch Panen</div>} />
          <Route path="/inventories" element={<div>Inventaris</div>} />
          <Route path="/business" element={<div>Entitas Bisnis Saya</div>} />
          <Route path="/transactions/purchases" element={<div>Pembelian (Purchase)</div>} />
          <Route path="/transactions/sales" element={<div>Penjualan (Sales)</div>} />
          <Route path="/waste" element={<div>Pencatatan Limbah</div>} />
          <Route path="/traceability" element={<div>Lacak Produk</div>} />
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
