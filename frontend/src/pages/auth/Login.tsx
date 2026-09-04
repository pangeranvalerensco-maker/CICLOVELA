import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string, password?: string}>({});
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    const newErrors: any = {};
    if (!email) newErrors.email = 'Email wajib diisi';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Format email tidak valid';
    
    if (!password) newErrors.password = 'Password wajib diisi';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await authApi.login({ email, password });
      const { token, id, name, email: userEmail, role } = res.data.data;
      
      login(token, { id, name, email: userEmail, role });
      toast.success('Login berhasil!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal login, periksa kembali email & password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* Back to Home */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-semibold transition-colors">
        <ArrowLeft size={20} /> Kembali
      </Link>

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100 relative z-10">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            Selamat Datang
          </h2>
          <p className="mt-3 text-center text-sm text-slate-500 font-medium">
            Masuk ke portal CICLOVELA Anda
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Alamat Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${errors.email ? 'text-rose-400' : 'text-slate-400'}`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors({...errors, email: undefined}); }}
                  className={`block w-full pl-11 pr-3 py-3 border rounded-xl text-sm font-medium outline-none transition-all ${
                    errors.email 
                      ? 'border-rose-300 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 bg-rose-50/30' 
                      : 'border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 bg-slate-50'
                  }`}
                  placeholder="anda@perusahaan.com"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs font-semibold text-rose-500">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${errors.password ? 'text-rose-400' : 'text-slate-400'}`} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors({...errors, password: undefined}); }}
                  className={`block w-full pl-11 pr-3 py-3 border rounded-xl text-sm font-medium outline-none transition-all ${
                    errors.password 
                      ? 'border-rose-300 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 bg-rose-50/30' 
                      : 'border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 bg-slate-50'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1.5 text-xs font-semibold text-rose-500">{errors.password}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-500/20 shadow-lg disabled:opacity-70 transition-all hover:-translate-y-0.5"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Masuk Sekarang'}
          </button>
        </form>

        <div className="pt-6 text-center text-sm font-medium border-t border-slate-100">
          <p className="text-slate-600">
            Belum punya akun?{' '}
            <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
