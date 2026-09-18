import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { authApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, Loader2, Tractor, ShoppingCart } from 'lucide-react';
import { hasMaxLength, hasMinLength, isEmail, isRequired } from '../../utils/validation';

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    role: 'CONSUMER'
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; passwordConfirmation?: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateField = (name: string, value: string) => {
    if (name === 'name') {
      if (!isRequired(value)) return t('common.validation_required');
      if (!hasMinLength(value, 3)) return t('common.validation_min', { min: 3 });
      if (!hasMaxLength(value, 100)) return t('common.validation_max', { max: 100 });
    }
    if (name === 'email') {
      if (!isRequired(value)) return t('common.validation_required');
      if (!isEmail(value)) return t('common.validation_email');
    }
    if (name === 'password') {
      if (!isRequired(value)) return t('common.validation_required');
      if (!hasMinLength(value, 8)) return t('common.validation_min', { min: 8 });
      if (!hasMaxLength(value, 100)) return t('common.validation_max', { max: 100 });
    }
    if (name === 'passwordConfirmation') {
      if (!isRequired(value)) return t('common.validation_required');
      if (value !== formData.password) return t('common.validation_match');
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = { ...formData, [e.target.name]: e.target.value };
    setFormData(next);
    setErrors((prev) => ({ ...prev, [e.target.name]: validateField(e.target.name, e.target.value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      passwordConfirmation: validateField('passwordConfirmation', formData.passwordConfirmation),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    try {
      setLoading(true);
      const res = await authApi.register(formData);
      const { token, id, name, email: userEmail, role } = res.data.data;
      
      login(token, { id, name, email: userEmail, role });
      toast.success('Registrasi berhasil!');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      const errors = err.response?.data?.errors;
      if (errors && errors.length > 0) {
        toast.error(errors[0].message);
      } else {
        toast.error(msg || 'Registrasi gagal');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Daftar CICLOVELA
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Bergabung dengan rantai pasok pertanian
          </p>
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              type="button"
              onClick={() => setFormData({...formData, role: 'FARMER'})}
              className={`p-3 border rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
                formData.role === 'FARMER' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Tractor size={24} />
              <span className="text-sm font-medium">Petani</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, role: 'CONSUMER'})}
              className={`p-3 border rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
                formData.role === 'CONSUMER' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <ShoppingCart size={24} />
              <span className="text-sm font-medium">Pembeli / Bisnis</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  minLength={3}
                  maxLength={100}
                  value={formData.name}
                  onChange={handleChange}
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                  placeholder="Nama Anda"
                />
              </div>
              {errors.name && <p className="mt-1 text-xs font-semibold text-rose-500">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  maxLength={150}
                  value={formData.email}
                  onChange={handleChange}
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                  placeholder="anda@email.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs font-semibold text-rose-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  maxLength={100}
                  value={formData.password}
                  onChange={handleChange}
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                  placeholder="Minimal 8 karakter"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs font-semibold text-rose-500">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="passwordConfirmation"
                  required
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                  placeholder="Ulangi password"
                />
              </div>
              {errors.passwordConfirmation && <p className="mt-1 text-xs font-semibold text-rose-500">{errors.passwordConfirmation}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-400"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Mendaftar'}
            </button>
          </div>
        </form>
        <div className="text-center text-sm">
          <p className="text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
