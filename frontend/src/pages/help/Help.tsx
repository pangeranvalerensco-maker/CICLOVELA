import { HelpCircle, BookOpen, Workflow, ShieldCheck, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Help = () => {
  const { t } = useTranslation();
  const items = [
    { icon: Workflow, title: t('help.flow_title'), text: t('help.flow_text') },
    { icon: BookOpen, title: t('help.product_title'), text: t('help.product_text') },
    { icon: ShieldCheck, title: t('help.security_title'), text: t('help.security_text') },
  ];

  return (
    <div className="animate-in fade-in duration-500 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle size={24} className="text-emerald-600" />
          {t('help.title')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('help.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((item) => (
          <div key={item.title} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
              <item.icon className="text-emerald-600 dark:text-emerald-400" size={24} />
            </div>
            <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{item.title}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden mt-8">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <HelpCircle size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2">{t('help.contact_title')}</h2>
          <p className="text-emerald-50 mb-6 max-w-xl text-sm leading-relaxed">{t('help.contact_text')}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="mailto:support@ciclovela.com" className="inline-flex items-center gap-2 bg-white text-emerald-700 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-50 transition-colors shadow-sm w-max">
              <Mail size={16} /> {t('help.contact_email')}
            </a>
            <a href="https://wa.me/6282275065026" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-emerald-800/50 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-800/70 border border-emerald-500/30 transition-colors shadow-sm w-max">
              <Phone size={16} /> {t('help.contact_phone')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
