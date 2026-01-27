'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

// Кастомный easing
const customEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Варианты анимации для контейнера со stagger эффектом
const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Варианты для отдельных элементов
const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: customEase,
    },
  },
};

// Варианты для fade эффекта без движения
const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// Варианты для появления слева
const slideLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: customEase,
    },
  },
};

// Варианты для появления справа
const slideRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: customEase,
    },
  },
};

// Варианты для масштабирования
const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: customEase,
    },
  },
};

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none' | 'scale';
  once?: boolean;
  amount?: number;
}

export function FadeIn({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  direction = 'up',
  once = true,
  amount = 0.3,
}: FadeInProps) {
  const getVariants = (): Variants => {
    switch (direction) {
      case 'left':
        return slideLeftVariants;
      case 'right':
        return slideRightVariants;
      case 'none':
        return fadeVariants;
      case 'scale':
        return scaleVariants;
      case 'down':
        return {
          hidden: { opacity: 0, y: -30, filter: 'blur(10px)' },
          visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration, ease: customEase },
          },
        };
      default:
        return itemVariants;
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={getVariants()}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

// Контейнер со stagger эффектом для детей
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: number;
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  delayChildren = 0.2,
  once = true,
  amount = 0.2,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Элемент внутри StaggerContainer
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none' | 'scale';
}

export function StaggerItem({
  children,
  className = '',
  direction = 'up',
}: StaggerItemProps) {
  const getVariants = (): Variants => {
    const baseTransition = {
      duration: 0.6,
      ease: customEase,
    };

    switch (direction) {
      case 'up':
        return {
          hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
          visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: baseTransition },
        };
      case 'down':
        return {
          hidden: { opacity: 0, y: -40, filter: 'blur(10px)' },
          visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: baseTransition },
        };
      case 'left':
        return {
          hidden: { opacity: 0, x: -40, filter: 'blur(10px)' },
          visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: baseTransition },
        };
      case 'right':
        return {
          hidden: { opacity: 0, x: 40, filter: 'blur(10px)' },
          visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: baseTransition },
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
          visible: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: baseTransition },
        };
      default:
        return {
          hidden: { opacity: 0, filter: 'blur(10px)' },
          visible: { opacity: 1, filter: 'blur(0px)', transition: baseTransition },
        };
    }
  };

  return (
    <motion.div className={className} variants={getVariants()}>
      {children}
    </motion.div>
  );
}

// Обёртка для всей страницы с плавным появлением
interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.5,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
}

// Текст с плавным появлением букв
interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TextReveal({ text, className = '', delay = 0 }: TextRevealProps) {
  const words = text.split(' ');

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: delay,
          },
        },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          variants={{
            hidden: {
              opacity: 0,
              y: 20,
              filter: 'blur(10px)',
            },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
