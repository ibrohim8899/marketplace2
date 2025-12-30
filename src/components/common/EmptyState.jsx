// src/components/common/EmptyState.jsx
import { useLanguage } from '../../context/LanguageContext';

export default function EmptyState({ message }) {
  const { t } = useLanguage();
  const finalMessage = message || t('emptystate_default');

  return (
    <div className="flex flex-col items-center justify-center h-40 text-gray-500">
      <span className="text-5xl mb-2">🤷‍♂️</span>
      <p className="font-medium">{finalMessage}</p>
    </div>
  );
}