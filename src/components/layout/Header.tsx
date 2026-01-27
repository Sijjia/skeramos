'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useZone } from '@/contexts/ZoneContext';
import { LanguageSwitcher } from '@/components/features/LanguageSwitcher';
import { useZoneTransition } from '@/components/animations/ZoneTransitionOverlay';

export function Header() {
  const { zone, toggleZone } = useZone();
  const locale = useLocale();
  const t = useTranslations('header');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass py-2'
          : 'glass md:bg-transparent md:backdrop-blur-none py-3 md:py-4'
      }`}
      style={{ transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)' }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
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
                className="object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {zone === 'creativity' ? (
              <>
                <NavLink href={`/${locale}/creativity`}>
                  Главная
                </NavLink>
                <NavLink href={`/${locale}/creativity#masterclasses`}>
                  {t('masterclasses')}
                </NavLink>
                <NavLink href={`/${locale}/services`}>
                  {t('services') || 'Услуги'}
                </NavLink>
                <NavLink href={`/${locale}/masters`}>
                  {t('masters') || 'Мастера'}
                </NavLink>
                <NavLink href={`/${locale}/gallery`}>
                  {t('gallery') || 'Галерея'}
                </NavLink>
              </>
            ) : (
              <>
                <NavLink href={`/${locale}/hotel`}>
                  Главная
                </NavLink>
                <NavLink href={`/${locale}/hotel/rooms`}>
                  {t('rooms')}
                </NavLink>
                <NavLink href={`/${locale}/hotel/cinema`}>
                  {t('cinema') || 'Кинозал'}
                </NavLink>
                <NavLink href={`/${locale}/hotel/packages`}>
                  {t('packages') || 'Пакеты'}
                </NavLink>
                <NavLink href={`/${locale}/gallery`}>
                  {t('gallery') || 'Галерея'}
                </NavLink>
              </>
            )}
            <NavLink href={`/${locale}/contacts`}>
              {t('contacts')}
            </NavLink>
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
              className="lg:hidden p-2 text-neutral-300 hover:text-white transition-colors"
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
                    href={`/${locale}/creativity#masterclasses`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t('masterclasses')}
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
                    href={`/${locale}/hotel/cinema`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t('cinema') || 'Кинозал'}
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
              <div className="pt-2 border-t border-white/10">
                <LanguageSwitcher />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative text-neutral-300 hover:text-white transition-colors link-magic"
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
      className="px-4 py-3 text-neutral-200 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
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
          backgroundColor: isCreativity ? '#5a7c48' : '#c42d54',
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Button background */}
      <motion.div
        className="relative w-14 h-14 rounded-full border border-white/20 flex items-center justify-center overflow-hidden"
        animate={{
          backgroundColor: isCreativity
            ? 'rgba(90, 124, 72, 0.3)'
            : 'rgba(196, 45, 84, 0.3)',
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
            backgroundColor: isCreativity ? '#7a9c68' : '#4a4a4a',
          }}
        />
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          animate={{
            scale: !isCreativity ? 1.3 : 0.8,
            backgroundColor: !isCreativity ? '#dc4b6f' : '#4a4a4a',
          }}
        />
      </div>
    </button>
  );
}

export { SpiralToggle };
