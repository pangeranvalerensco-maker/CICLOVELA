import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Settings as SettingsIcon, User, Globe, Moon, Sun, Monitor } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { authApi } from '../../api/auth';
import { hasMaxLength, hasMinLength, isPhone, isRequired } from '../../utils/validation';

const emptyProfile = {
  name: '',
  phone: '',
  gender: '',
  dateOfBirth: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
};

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState(emptyProfile);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const validateProfileField = (name: string, value: string) => {
    if (name === 'name') {
      if (!isRequired(value)) return t('common.validation_required');
      if (!hasMinLength(value, 3)) return t('common.validation_min', { min: 3 });
      if (!hasMaxLength(value, 100)) return t('common.validation_max', { max: 100 });
    }
    if (name === 'phone' && !isPhone(value)) return t('common.validation_phone');
    return undefined;
  };

  const updateProfileField = (name: 'name' | 'phone', value: string) => {
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: validateProfileField(name, value) }));
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await authApi.getMe();
        const p = res.data?.data || {};
        setForm({
          name: p.name || user?.name || '',
          phone: p.phone || '',
          gender: p.gender || '',
          dateOfBirth: p.dateOfBirth || '',
          address: p.address || '',
          city: p.city || '',
          province: p.province || '',
          postalCode: p.postalCode || '',
        });
      } catch {
        toast.error(t('settings.load_error'));
        setForm({ ...emptyProfile, name: user?.name || '' });
      } finally {
        setLoadingProfile(false);
      }
    };
    loadProfile();
  }, [t, user?.name]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const nextErrors = {
      name: validateProfileField('name', form.name),
      phone: validateProfileField('phone', form.phone),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        phone: form.phone || null,
        gender: form.gender || null,
        dateOfBirth: form.dateOfBirth || null,
        address: form.address || null,
        city: form.city || null,
        province: form.province || null,
        postalCode: form.postalCode || null,
      };
      const res = await authApi.updateMe(payload);
      const updated = res.data?.data;
      updateUser({
        id: user.id,
        name: updated?.name || form.name,
        email: user.email,
        role: user.role,
      });
      setIsEditing(false);
      toast.success(t('settings.save_success'));
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('settings.save_error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <SettingsIcon size={24} className="text-emerald-600" />
          {t('settings.title')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('settings.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <User className="text-blue-500" size={24} />
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('settings.profile')}</h2>
            </div>
            <button type="button" onClick={() => setIsEditing(!isEditing)} className="px-3 py-1.5 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10">
              {isEditing ? t('common.cancel') : t('settings.edit')}
            </button>
          </div>
          {loadingProfile ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">...</p>
          ) : !isEditing ? (
            <div className="space-y-3 text-sm">
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('settings.editing_hint')}</p>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg font-medium text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700">{form.name}</div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg font-medium text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700">{user?.email}</div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg font-medium text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700">{form.phone || '-'}</div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">{t('settings.full_name')}</label>
                <input required minLength={3} maxLength={100} value={form.name} onChange={(e) => updateProfileField('name', e.target.value)} className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500" />
                {errors.name && <p className="mt-1 text-xs font-semibold text-rose-500">{errors.name}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">{t('settings.contact_email')}</label>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700">
                  {user?.email}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">{t('settings.phone')}</label>
                  <input type="tel" maxLength={20} value={form.phone} onChange={(e) => updateProfileField('phone', e.target.value)} className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500" />
                  {errors.phone && <p className="mt-1 text-xs font-semibold text-rose-500">{errors.phone}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">{t('settings.gender')}</label>
                  <input value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">{t('settings.dob')}</label>
                <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">{t('settings.address')}</label>
                <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">{t('settings.city')}</label>
                  <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">{t('settings.province')}</label>
                  <input value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">{t('settings.postal_code')}</label>
                  <input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">{t('settings.account_role')}</label>
                <div className="inline-flex px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-lg text-sm font-bold">
                  {user?.role}
                </div>
              </div>
              <button type="submit" disabled={saving} className="w-full py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-60">
                {saving ? t('settings.saving') : t('settings.save')}
              </button>
            </div>
          )}
        </form>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <Monitor className="text-indigo-500" size={24} />
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('settings.appearance')}</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">{t('settings.dark_mode')}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('settings.dark_mode_desc')}</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${theme === 'dark' ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-8' : 'translate-x-1'}`} />
                <span className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
                  <Moon size={12} className={theme === 'dark' ? 'text-white' : 'text-slate-400'} />
                  <Sun size={12} className={theme === 'dark' ? 'text-emerald-200' : 'text-white'} />
                </span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <Globe className="text-rose-500" size={24} />
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('settings.language')}</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{t('settings.language_desc')}</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => i18n.changeLanguage('id')}
                className={`p-3 border rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all ${i18n.language === 'id' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                Indonesia
              </button>
              <button
                onClick={() => i18n.changeLanguage('en')}
                className={`p-3 border rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all ${i18n.language === 'en' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
