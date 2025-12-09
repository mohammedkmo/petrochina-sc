import type { Metadata } from "next";
import { Noto_Kufi_Arabic, Geist } from "next/font/google";
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import "../globals.css";

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700","800","900"],
  variable: "--font-noto-kufi-arabic",
});

const geist = Geist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "PetroChina - Security Clearance Application",
  description: "Generate SC Application in a digital format",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params
}: Props) {


    // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  


  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body
        className={`${notoKufiArabic.variable} ${geist.variable} antialiased`}
        style={{ fontFamily: 'var(--font-noto-kufi-arabic), var(--font-geist), sans-serif' }}
      >
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}