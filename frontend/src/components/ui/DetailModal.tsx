import { useTranslation } from 'react-i18next';
import Modal from './Modal';

export interface DetailRow {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  imageUrl?: string | null;
  imageAlt?: string;
  rows: DetailRow[];
}

const DetailModal = ({ isOpen, onClose, title, imageUrl, imageAlt, rows }: DetailModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="space-y-4 text-sm">
        {imageUrl && (
          <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
            <img src={imageUrl} alt={imageAlt || title} className="w-full h-full object-cover" />
          </div>
        )}
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {rows.map((row) => (
            <div key={row.label} className="min-w-0">
              <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{row.label}</dt>
              <dd className={`text-slate-800 dark:text-slate-100 font-medium break-words ${row.mono ? 'font-mono text-xs' : ''}`}>
                {row.value ?? '-'}
              </dd>
            </div>
          ))}
        </dl>
        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DetailModal;
