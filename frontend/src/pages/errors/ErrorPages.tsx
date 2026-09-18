import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Lock, SearchX, ServerCrash, RotateCw } from 'lucide-react';

const shell = 'min-h-screen flex items-center justify-center px-6 bg-slate-50 dark:bg-slate-950';

function Card({ code, title, desc, icon, to = '/', action }: {
  code: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  to?: string;
  action?: string;
}) {
  const { t } = useTranslation();
  return (
    <div className={shell}>
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-8 text-center">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-300">
          {icon}
        </div>
        <p className="text-xs font-bold tracking-widest text-slate-400">{code}</p>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{title}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{desc}</p>
        <Link to={to} className="inline-block mt-6 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">
          {action || t('errors.back_home')}
        </Link>
      </div>
    </div>
  );
}

export const Unauthorized = () => {
  const { t } = useTranslation();
  return <Card code="401" title={t('errors.e401_title')} desc={t('errors.e401_desc')} icon={<Lock size={22} />} to="/login" action={t('errors.back_login')} />;
};

export const Forbidden = () => {
  const { t } = useTranslation();
  return <Card code="403" title={t('errors.e403_title')} desc={t('errors.e403_desc')} icon={<Lock size={22} />} />;
};

export const NotFound = () => {
  const { t } = useTranslation();
  return <Card code="404" title={t('errors.e404_title')} desc={t('errors.e404_desc')} icon={<SearchX size={22} />} />;
};

export const ServerError = () => {
  const { t } = useTranslation();
  return (
    <div className={shell}>
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-8 text-center">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500">
          <ServerCrash size={22} />
        </div>
        <p className="text-xs font-bold tracking-widest text-slate-400">500</p>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{t('errors.e500_title')}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{t('errors.e500_desc')}</p>
        <div className="flex justify-center gap-3 mt-6">
          <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
            <RotateCw size={16} /> {t('errors.retry')}
          </button>
          <Link to="/" className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">
            {t('errors.back_home')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export const ApiFallback = ({ message, onRetry }: { message?: string; onRetry?: () => void }) => {
  const { t } = useTranslation();
  return (
    <div className="text-center py-12">
      <div className="mx-auto mb-3 w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
        <AlertTriangle size={18} />
      </div>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{message || t('errors.api_failed')}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('errors.api_hint')}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">
          <RotateCw size={15} /> {t('errors.retry')}
        </button>
      )}
    </div>
  );
};
