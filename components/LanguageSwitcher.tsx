'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const t = useTranslations('language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {routing.locales.map((lang) => (
        <button
          key={lang}
          onClick={() => switchLanguage(lang)}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
            ${locale === lang 
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
            }
          `}
        >
          {lang === 'en' ? t('english') : t('arabic')}
        </button>
      ))}
    </div>
  );
}