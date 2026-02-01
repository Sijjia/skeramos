'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useZone } from '@/contexts/ZoneContext';
import { LanguageSwitcher } from '@/components/features/LanguageSwitcher';
import { useZoneTransition } from '@/components/animations/ZoneTransitionOverlay';

export function Header() {
  const { zone, toggleZone } = useZone();
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('header');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide header on landing/split screen page
  const isLandingPage = pathname === `/${locale}` || pathname === `/${locale}/`;

  // Only main creativity/hotel pages have dark hero backgrounds
  const isDarkHeroPage = pathname === `/${locale}/creativity` ||
                         pathname === `/${locale}/hotel`;

  // Header should be light (white text) when on dark hero and not scrolled
  const isLightHeader = isDarkHeroPage && !scrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't render header on landing page
  if (isLandingPage) {
    return null;
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass py-2 shadow-lg'
          : 'bg-transparent py-3 md:py-4'
      }`}
      style={{ transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)' }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo - adapts to background */}
          <Link
            href={`/${locale}/${zone}`}
            className="flex items-center group"
          >
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="relative w-14 h-14 md:w-16 md:h-16"
            >
              <Image
                src="/logo.png"
                alt="Skeramos"
                fill
                className={`object-contain opacity-80 group-hover:opacity-100 transition-all duration-300 ${
                  isLightHeader ? 'brightness-0 invert' : 'brightness-0'
                }`}
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {zone === 'creativity' ? (
              <>
                <NavLink href={`/${locale}/creativity`} light={isLightHeader}>Главная</NavLink>
                <NavLink href={`/${locale}/creativity#about`} light={isLightHeader}>О нас</NavLink>
                <NavLink href={`/${locale}/services`} light={isLightHeader}>{t('services') || 'Услуги'}</NavLink>
                <NavLink href={`/${locale}/masters`} light={isLightHeader}>{t('masters') || 'Мастера'}</NavLink>
                <NavLink href={`/${locale}/afisha`} light={isLightHeader}>Афиша</NavLink>
                <NavLink href={`/${locale}/gallery`} light={isLightHeader}>{t('gallery') || 'Галерея'}</NavLink>
              </>
            ) : (
              <>
                <NavLink href={`/${locale}/hotel`} light={isLightHeader}>Главная</NavLink>
                <NavLink href={`/${locale}/hotel/rooms`} light={isLightHeader}>{t('rooms')}</NavLink>
                <NavLink href={`/${locale}/hotel/packages`} light={isLightHeader}>{t('packages') || 'Пакеты'}</NavLink>
                <NavLink href={`/${locale}/gallery`} light={isLightHeader}>{t('gallery') || 'Галерея'}</NavLink>
              </>
            )}
            <NavLink href={`/${locale}/contacts`} light={isLightHeader}>{t('contacts')}</NavLink>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Zone Toggle */}
            <SpiralToggle zone={zone} onToggle={toggleZone} />

            {/* Language */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden p-2 transition-colors ${
                isLightHeader
                  ? 'text-white/80 hover:text-white'
                  : 'text-neutral-700 hover:text-neutral-900'
              }`}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass mt-2 mx-4 rounded-2xl overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-2">
              {zone === 'creativity' ? (
                <>
                  <MobileNavLink
                    href={`/${locale}/creativity`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Главная
                  </MobileNavLink>
                  <MobileNavLink
                    href={`/${locale}/creativity#about`}
                    onClick={() => setMenuOpen(false)}
                  >
                    О нас
                  </MobileNavLink>
                  <MobileNavLink
                    href={`/${locale}/services`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t('services') || 'Услуги'}
                  </MobileNavLink>
                  <MobileNavLink
                    href={`/${locale}/masters`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t('masters') || 'Мастера'}
                  </MobileNavLink>
                  <MobileNavLink
                    href={`/${locale}/afisha`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Афиша
                  </MobileNavLink>
                  <MobileNavLink
                    href={`/${locale}/gallery`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t('gallery') || 'Галерея'}
                  </MobileNavLink>
                </>
              ) : (
                <>
                  <MobileNavLink
                    href={`/${locale}/hotel`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Главная
                  </MobileNavLink>
                  <MobileNavLink
                    href={`/${locale}/hotel/rooms`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t('rooms')}
                  </MobileNavLink>
                  <MobileNavLink
                    href={`/${locale}/hotel/packages`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t('packages') || 'Пакеты'}
                  </MobileNavLink>
                  <MobileNavLink
                    href={`/${locale}/gallery`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t('gallery') || 'Галерея'}
                  </MobileNavLink>
                </>
              )}
              <MobileNavLink
                href={`/${locale}/contacts`}
                onClick={() => setMenuOpen(false)}
              >
                {t('contacts')}
              </MobileNavLink>
              <div className="pt-2 border-t border-neutral-200">
                <LanguageSwitcher />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function NavLink({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return (
    <Link
      href={href}
      className={`relative transition-colors link-magic ${
        light
          ? 'text-white/80 hover:text-white'
          : 'text-neutral-700 hover:text-neutral-900'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-4 py-3 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
    >
      {children}
    </Link>
  );
}

interface SpiralToggleProps {
  zone: 'creativity' | 'hotel';
  onToggle: () => void;
}

function SpiralToggle({ zone, onToggle }: SpiralToggleProps) {
  const isCreativity = zone === 'creativity';
  const router = useRouter();
  const locale = useLocale();
  const { startTransition } = useZoneTransition();

  const handleToggle = () => {
    const toZone = isCreativity ? 'hotel' : 'creativity';

    // Запускаем красивый переход
    startTransition(toZone, () => {
      onToggle();
      router.push(`/${locale}/${toZone}`);
    });
  };

  return (
    <button
      onClick={handleToggle}
      className="relative group focus-ring rounded-full"
      role="switch"
      aria-checked={!isCreativity}
      aria-label={`Переключить на зону ${isCreativity ? 'Отель' : 'Творчество'}`}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"
        animate={{
          backgroundColor: isCreativity ? '#a93b24' : '#216b5e',
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Button background */}
      <motion.div
        className="relative w-14 h-14 rounded-full border border-white/20 flex items-center justify-center overflow-hidden"
        animate={{
          backgroundColor: isCreativity
            ? 'rgba(169, 59, 36, 0.3)'
            : 'rgba(33, 107, 94, 0.3)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo inside */}
        <motion.div
          className="w-8 h-8 relative"
          animate={{ rotate: isCreativity ? 0 : 180 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
          }}
        >
          <Image
            src="/logo.png"
            alt=""
            fill
            className="object-contain brightness-0 invert"
          />
        </motion.div>
      </motion.div>

      {/* Zone indicators */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          animate={{
            scale: isCreativity ? 1.3 : 0.8,
            backgroundColor: isCreativity ? '#a93b24' : '#4a4a4a',
          }}
        />
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          animate={{
            scale: !isCreativity ? 1.3 : 0.8,
            backgroundColor: !isCreativity ? '#216b5e' : '#4a4a4a',
          }}
        />
      </div>
    </button>
  );
}

export { SpiralToggle };
