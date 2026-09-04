import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email wajib diisi');
      return;
    }

    try {
      setLoading(true);
      await authApi.forgotPassword({ email });
      setSuccess(true);
      toast.success('Permintaan reset password berhasil dikirim');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal, periksa kembali email Anda');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Periksa Email Anda</h2>
          <p className="text-gray-600 mt-2">
            Kami telah mengirimkan instruksi dan tautan untuk mereset password Anda ke email <strong>{email}</strong>.
          </p>
          
          <div className="mt-6">
            <Link to="/login" className="text-emerald-600 font-medium hover:text-emerald-500">
              Kembali ke Halaman Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Lupa Password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Masukkan email yang terdaftar, kami akan mengirimkan link reset password.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                placeholder="anda@email.com"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-400"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Kirim Link Reset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
