'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import type { Locale } from '@/lib/sanity/types';

// Type definitions for UI data
export interface MasterclassUI {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  capacity: string;
  price: number;
  slug?: string;
}

export interface CourseUI {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  capacity: string;
  price: number;
  slug?: string;
}

export interface EventUI {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  capacity: string;
  price: number;
  priceLabel?: string;
  slug?: string;
  eventType?: string;
}

export interface RoomUI {
  id: string;
  title: string;
  description: string;
  images: string[];
  amenities: { icon: 'bed' | 'tv' | 'heating' | 'wifi' | 'shower' | 'kitchen'; label: string }[];
  price: number;
  slug?: string;
}

export interface PackageUI {
  id: string;
  title: string;
  description: string;
  image: string;
  includes: string[];
  price: number;
  featured: boolean;
  slug?: string;
}

export interface FAQUI {
  question: string;
  answer: string;
}

// Generic hook for fetching Sanity data with fallback
function useSanityFetch<T>(
  fetchFn: (locale: Locale) => Promise<T>,
  fallbackData: T,
  dependencies: unknown[] = []
): { data: T; loading: boolean; error: Error | null } {
  const locale = useLocale() as Locale;
  const [data, setData] = useState<T>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      // Check if Sanity is configured
      const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
      if (!projectId || projectId === 'placeholder') {
        setData(fallbackData);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await fetchFn(locale);
        if (!cancelled) {
          // Use fallback if no data returned
          setData(result && (Array.isArray(result) ? result.length > 0 : true) ? result : fallbackData);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('Sanity fetch error, using fallback data:', err);
          setData(fallbackData);
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, ...dependencies]);

  return { data, loading, error };
}

// ============================================================================
// Mock Data (fallback when Sanity is not configured)
// ============================================================================

const MOCK_MASTERCLASSES: MasterclassUI[] = [
  {
    id: '1',
    title: 'Знакомство с гончарным кругом',
    description: 'Первый шаг в мир керамики. Вы создадите свою первую чашу или вазу под руководством мастера.',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
    duration: '2 часа',
    capacity: '1-4 чел',
    price: 2500,
  },
  {
    id: '2',
    title: 'Лепка из пласта',
    description: 'Освойте технику ручной лепки и создайте уникальную тарелку или блюдо с авторским декором.',
    image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&q=80',
    duration: '2.5 часа',
    capacity: '1-6 чел',
    price: 2800,
  },
  {
    id: '3',
    title: 'Роспись керамики',
    description: 'Украсьте готовое изделие глазурью и ангобами. Идеально для тех, кто хочет творить без круга.',
    image: 'https://images.unsplash.com/photo-1603665301175-57ba46f392bf?w=800&q=80',
    duration: '1.5 часа',
    capacity: '1-8 чел',
    price: 2000,
  },
  {
    id: '4',
    title: 'Свидание на гончарном круге',
    description: 'Романтический мастер-класс для пар. Создайте памятные изделия вместе.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
    duration: '2 часа',
    capacity: '2 чел',
    price: 5500,
  },
];

const MOCK_COURSES: CourseUI[] = [
  {
    id: '1',
    title: 'Базовый курс гончарного мастерства',
    description: 'Полный курс для начинающих: от центровки глины до обжига. 8 занятий по 3 часа.',
    image: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=800&q=80',
    duration: '8 занятий',
    capacity: '4-6 чел',
    price: 35000,
  },
  {
    id: '2',
    title: 'Продвинутая керамика',
    description: 'Для тех, кто освоил базу. Сложные формы, авторские техники, работа с глазурями.',
    image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=800&q=80',
    duration: '12 занятий',
    capacity: '3-4 чел',
    price: 55000,
  },
];

const MOCK_EVENTS: EventUI[] = [
  {
    id: '1',
    title: 'Корпоративный тимбилдинг',
    description: 'Объедините команду за творческим процессом. Каждый участник создаст своё изделие.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    duration: '3 часа',
    capacity: 'до 20 чел',
    price: 3000,
    priceLabel: 'от',
  },
  {
    id: '2',
    title: 'День рождения в мастерской',
    description: 'Незабываемый праздник для детей и взрослых. Включает мастер-класс и чаепитие.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80',
    duration: '2.5 часа',
    capacity: 'до 12 чел',
    price: 25000,
    priceLabel: 'от',
  },
  {
    id: '3',
    title: 'Девичник',
    description: 'Творческое время с подругами. Создайте керамику, которая напомнит о веселом дне.',
    image: 'https://images.unsplash.com/photo-1529543544277-750e1b25e5f4?w=800&q=80',
    duration: '2.5 часа',
    capacity: 'до 8 чел',
    price: 20000,
    priceLabel: 'от',
  },
];

const MOCK_ROOMS: RoomUI[] = [
  {
    id: '1',
    title: 'Стандарт',
    description: 'Уютный номер для одного или двух гостей. Всё необходимое для комфортного отдыха.',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
    ],
    amenities: [
      { icon: 'bed', label: '2 места' },
      { icon: 'tv', label: 'ТВ' },
      { icon: 'wifi', label: 'Wi-Fi' },
    ],
    price: 3500,
  },
  {
    id: '2',
    title: 'Комфорт',
    description: 'Просторный номер с дополнительными удобствами и мини-кухней.',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    ],
    amenities: [
      { icon: 'bed', label: '2 места' },
      { icon: 'tv', label: 'ТВ' },
      { icon: 'wifi', label: 'Wi-Fi' },
      { icon: 'kitchen', label: 'Кухня' },
    ],
    price: 5000,
  },
  {
    id: '3',
    title: 'Люкс',
    description: 'Премиальный номер с отдельной гостиной, тёплым полом и панорамным видом.',
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80',
    ],
    amenities: [
      { icon: 'bed', label: '2 места' },
      { icon: 'tv', label: 'ТВ' },
      { icon: 'wifi', label: 'Wi-Fi' },
      { icon: 'heating', label: 'Тёплый пол' },
      { icon: 'kitchen', label: 'Кухня' },
    ],
    price: 8000,
  },
];

const MOCK_PACKAGES: PackageUI[] = [
  {
    id: '1',
    title: 'Романтический вечер',
    description: 'Идеальное свидание для двоих с ужином и атмосферой.',
    image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80',
    includes: [
      'Номер "Комфорт" на ночь',
      'Шампанское и фрукты',
      'Романтический декор',
      'Поздний выезд до 14:00',
    ],
    price: 12000,
    featured: true,
  },
  {
    id: '2',
    title: 'Свидание гончаров',
    description: 'Мастер-класс для пары + проживание в отеле.',
    image: 'https://images.unsplash.com/photo-1607478900766-efe13248b125?w=800&q=80',
    includes: [
      'Мастер-класс на двоих',
      'Номер "Стандарт" на ночь',
      'Завтрак в постель',
      'Готовые изделия в подарок',
    ],
    price: 15000,
    featured: false,
  },
  {
    id: '3',
    title: 'Кинозал для двоих',
    description: 'Приватный кинопросмотр + романтическая обстановка.',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    includes: [
      '2 часа приватного кинозала',
      'Попкорн и напитки',
      'Выбор фильма на ваш вкус',
      'Мягкие пледы',
    ],
    price: 5000,
    featured: false,
  },
];

const MOCK_FAQ_CREATIVITY: FAQUI[] = [
  {
    question: 'Нужен ли опыт для участия в мастер-классе?',
    answer: 'Нет, наши мастер-классы подходят для полных новичков. Мастер объяснит всё с нуля и поможет на каждом этапе.',
  },
  {
    question: 'Что входит в стоимость мастер-класса?',
    answer: 'В стоимость входят все материалы, работа мастера, обжиг изделия и упаковка. Вы забираете готовое изделие через 2-3 недели после обжига.',
  },
  {
    question: 'Можно ли прийти со своими идеями?',
    answer: 'Конечно! Мы приветствуем творческий подход. Обсудите свою идею с мастером перед началом занятия.',
  },
  {
    question: 'Как записаться на мастер-класс?',
    answer: 'Напишите нам в WhatsApp или Telegram, и мы подберём удобное время. Также можно позвонить по телефону.',
  },
  {
    question: 'Подходит ли мастер-класс для детей?',
    answer: 'Да! Мы проводим мастер-классы для детей от 6 лет. Для самых маленьких рекомендуем лепку из пласта.',
  },
];

const MOCK_FAQ_HOTEL: FAQUI[] = [
  {
    question: 'Во сколько заезд и выезд?',
    answer: 'Стандартный заезд — с 14:00, выезд — до 12:00. Ранний заезд или поздний выезд возможен по предварительной договорённости.',
  },
  {
    question: 'Как оплатить проживание?',
    answer: 'Мы принимаем наличные, банковские карты и переводы. Предоплата 50% при бронировании, остаток — при заселении.',
  },
  {
    question: 'Можно ли отменить бронирование?',
    answer: 'Бесплатная отмена за 24 часа до заезда. При отмене позже — предоплата не возвращается.',
  },
  {
    question: 'Есть ли парковка?',
    answer: 'Да, бесплатная охраняемая парковка для гостей отеля.',
  },
  {
    question: 'Разрешено ли проживание с животными?',
    answer: 'К сожалению, проживание с домашними животными не предусмотрено.',
  },
];

// ============================================================================
// Export hooks
// ============================================================================

export function useMasterclasses() {
  return useSanityFetch<MasterclassUI[]>(
    async (locale) => {
      const { getMasterclassesForUI } = await import('@/lib/sanity/fetch');
      return getMasterclassesForUI(locale);
    },
    MOCK_MASTERCLASSES
  );
}

export function useCourses() {
  return useSanityFetch<CourseUI[]>(
    async (locale) => {
      const { getCoursesForUI } = await import('@/lib/sanity/fetch');
      return getCoursesForUI(locale);
    },
    MOCK_COURSES
  );
}

export function useEvents() {
  return useSanityFetch<EventUI[]>(
    async (locale) => {
      const { getEventsForUI } = await import('@/lib/sanity/fetch');
      return getEventsForUI(locale);
    },
    MOCK_EVENTS
  );
}

export function useRooms() {
  return useSanityFetch<RoomUI[]>(
    async (locale) => {
      const { getRoomsForUI } = await import('@/lib/sanity/fetch');
      return getRoomsForUI(locale);
    },
    MOCK_ROOMS
  );
}

export function usePackages() {
  return useSanityFetch<PackageUI[]>(
    async (locale) => {
      const { getPackagesForUI } = await import('@/lib/sanity/fetch');
      return getPackagesForUI(locale);
    },
    MOCK_PACKAGES
  );
}

export function useFAQ(zone: 'creativity' | 'hotel') {
  const fallback = zone === 'creativity' ? MOCK_FAQ_CREATIVITY : MOCK_FAQ_HOTEL;

  return useSanityFetch<FAQUI[]>(
    async (locale) => {
      const { getFAQForUI } = await import('@/lib/sanity/fetch');
      return getFAQForUI(zone, locale);
    },
    fallback,
    [zone]
  );
}
