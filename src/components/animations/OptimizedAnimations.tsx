'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * Оптимизированные анимации для Skeramos
 * - Используют CSS transforms вместо JS где возможно
 * - IntersectionObserver для ленивой активации
 * - Минимум подписок на scroll
 */

// ============================================================================
// FadeInOnScroll - Появление элементов при скролле (как на chamotte.de)
// ============================================================================

interface FadeInOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  scale?: boolean;
  once?: boolean;
}

export function FadeInOnScroll({
  children,
  className = '',
  delay = 0,
  duration = 0.65,
  direction = 'up',
  scale = true,
  once = true,
}: FadeInOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-10% 0px -10% 0px' });
  const shouldReduceMotion = useReducedMotion();

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 },
  };

  const initialOffset = directions[direction];

  // Always render motion.div but disable animations if reduced motion is preferred
  const reduceMotion = shouldReduceMotion ?? false;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduceMotion ? { opacity: 1 } : {
        opacity: 0,
        ...initialOffset,
        scale: scale ? 0.95 : 1,
      }}
      animate={reduceMotion ? { opacity: 1 } : (isInView ? {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      } : {
        opacity: 0,
        ...initialOffset,
        scale: scale ? 0.95 : 1,
      })}
      transition={reduceMotion ? { duration: 0 } : {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// StaggerContainer - Контейнер для последовательной анимации детей
// ============================================================================

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  once = true,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-5% 0px' });
  const shouldReduceMotion = useReducedMotion();

  // Always render same structure for SSR hydration
  const reduceMotion = shouldReduceMotion ?? false;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduceMotion ? 'visible' : 'hidden'}
      animate={reduceMotion ? 'visible' : (isInView ? 'visible' : 'hidden')}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduceMotion ? 0 : staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// StaggerItem - Элемент внутри StaggerContainer
// ============================================================================

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// ParallaxBackground - Легкий параллакс на CSS
// ============================================================================

interface ParallaxBackgroundProps {
  children: ReactNode;
  className?: string;
  intensity?: number; // 0.1 - 0.5 recommended
}

export function ParallaxBackground({
  children,
  className = '',
  intensity = 0.2,
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion || !ref.current) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const elementCenter = rect.top + rect.height / 2;
            const viewportCenter = viewportHeight / 2;
            const distance = elementCenter - viewportCenter;
            setOffset(distance * intensity);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [intensity, shouldReduceMotion]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 -z-10 transition-transform duration-100 ease-out"
        style={{
          transform: shouldReduceMotion ? 'none' : `translateY(${offset}px)`,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// LiveBackground - Живой фон с этно-паттернами при скролле
// ============================================================================

interface LiveBackgroundProps {
  className?: string;
  pattern?: 'tunduk' | 'shyrdak' | 'waves';
  color?: string;
}

export function LiveBackground({
  className = '',
  pattern = 'tunduk',
  color = 'currentColor',
}: LiveBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY * 0.1);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldReduceMotion]);

  const patterns = {
    tunduk: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='${encodeURIComponent(color)}' stroke-width='0.5' opacity='0.1'%3E%3Ccircle cx='60' cy='60' r='25'/%3E%3Ccircle cx='60' cy='60' r='15'/%3E%3Cpath d='M60 35 L60 45 M60 75 L60 85 M35 60 L45 60 M75 60 L85 60'/%3E%3C/g%3E%3C/svg%3E")`,
    shyrdak: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='${encodeURIComponent(color)}' stroke-width='0.5' opacity='0.1' d='M40 10 L50 20 L40 30 L30 20 Z M40 50 L50 60 L40 70 L30 60 Z'/%3E%3C/svg%3E")`,
    waves: `url("data:image/svg+xml,%3Csvg width='200' height='40' viewBox='0 0 200 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='${encodeURIComponent(color)}' stroke-width='1' opacity='0.1' d='M0 20 Q25 5 50 20 Q75 35 100 20 Q125 5 150 20 Q175 35 200 20'/%3E%3C/svg%3E")`,
  };

  return (
    <div
      ref={ref}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: patterns[pattern],
        backgroundSize: pattern === 'waves' ? '200px 40px' : '120px 120px',
        backgroundPosition: shouldReduceMotion ? 'center' : `${scrollY}px ${scrollY * 0.5}px`,
        transition: 'background-position 0.1s ease-out',
      }}
    />
  );
}

// ============================================================================
// TextReveal - Появление текста по буквам/словам
// ============================================================================

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  by?: 'word' | 'character';
}

export function TextReveal({
  text,
  className = '',
  delay = 0,
  by = 'word',
}: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const shouldReduceMotion = useReducedMotion();

  const units = by === 'word' ? text.split(' ') : text.split('');
  const separator = by === 'word' ? ' ' : '';

  // Always render same structure for SSR hydration
  const reduceMotion = shouldReduceMotion ?? false;

  return (
    <span ref={ref} className={className}>
      {units.map((unit, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={reduceMotion ? { opacity: 1, y: 0 } : (isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 })}
          transition={reduceMotion ? { duration: 0 } : {
            duration: 0.4,
            delay: delay + i * 0.05,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {unit}{separator}
        </motion.span>
      ))}
    </span>
  );
}

// ============================================================================
// CountUp - Анимация счётчика (SSR-safe)
// ============================================================================

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function CountUp({
  end,
  duration = 2,
  prefix = '',
  suffix = '',
  className = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(end); // Start with end value for SSR
  const [isMounted, setIsMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Отмечаем что компонент смонтирован на клиенте
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !isInView) return;

    if (shouldReduceMotion) {
      setCount(end);
      return;
    }

    setCount(0);
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration, shouldReduceMotion, isMounted]);

  // Используем простое число без локализации для SSR
  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}
