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
    <div className="flex items-center gap-0.5 bg-gray-50 rounded-md p-0.5">
      {routing.locales.map((lang) => (
        <button
          key={lang}
          onClick={() => switchLanguage(lang)}
          className={`
            px-3 py-1.5 text-xs font-medium rounded transition-all duration-150
            ${locale === lang 
              ? 'bg-white text-gray-900' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }
          `}
          aria-label={lang === 'en' ? t('english') : t('arabic')}
          aria-pressed={locale === lang}
        >
          {lang === 'en' ? t('english') : t('arabic')}
        </button>
      ))}
    </div>
  );
}