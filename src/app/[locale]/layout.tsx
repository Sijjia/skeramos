import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { ZoneProvider } from '@/contexts/ZoneContext';
import { AnalyticsProvider } from '@/components/analytics';
import { ZoneTransitionProvider } from '@/components/animations/ZoneTransitionOverlay';
import { ZoneColorTransition } from '@/components/animations/ZoneColorTransition';
import { Header } from '@/components/layout/Header';
import { OnboardingHint } from '@/components/features';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the locale
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ZoneProvider>
        <ZoneTransitionProvider>
          {/* Header outside ZoneColorTransition for iOS fixed positioning */}
          <Header />
          <OnboardingHint />
          <ZoneColorTransition>
            <AnalyticsProvider>
              {children}
            </AnalyticsProvider>
          </ZoneColorTransition>
        </ZoneTransitionProvider>
      </ZoneProvider>
    </NextIntlClientProvider>
  );
}
