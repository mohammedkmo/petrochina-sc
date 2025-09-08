import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import "../globals.css";

const rubik = Rubik({
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Peto - Security Clearance",
  description: "Generate SC request files",
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
        className={`${rubik.className} antialiased`}
      >
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}