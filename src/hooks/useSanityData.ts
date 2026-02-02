'use client';

import { useState, useEffect } from 'react';

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

export interface MasterUI {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  experience?: string;
  specialties: string[];
  achievements: string[];
  whatsapp?: string;
  active?: boolean;
}

export interface GalleryItemUI {
  id: string;
  title: string;
  image: string;
  category?: string;
}

export interface FAQUI {
  question: string;
  answer: string;
}

export interface ServiceUI {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  price: number;
  priceNote?: string;
  duration: string;
  groupSize: string;
  includes: string[];
  category: 'masterclass' | 'course' | 'event';
  externalLink?: string;
}

// Generic hook for fetching data from our API
function useDataFetch<T>(
  collection: string,
  fallbackData: T
): { data: T; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/data/${collection}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!cancelled) {
          // Используем пустой массив как fallback если данных нет
          if (Array.isArray(result) && result.length > 0) {
            setData(result as T);
          } else if (!Array.isArray(result) && Object.keys(result).length > 0) {
            setData(result as T);
          } else {
            setData(fallbackData);
          }
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('Data fetch error:', err);
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
  }, [collection, fallbackData]);

  return { data, loading, error };
}

// ============================================================================
// FAQ Data (это статические данные, которые не редактируются через админку)
// ============================================================================

const FAQ_CREATIVITY: FAQUI[] = [
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

const FAQ_HOTEL: FAQUI[] = [
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
// Export hooks - данные получаются из нашего API
// ============================================================================

const EMPTY_ARRAY: never[] = [];

export function useMasterclasses() {
  return useDataFetch<MasterclassUI[]>('masterclasses', EMPTY_ARRAY);
}

export function useCourses() {
  // Курсы пока не в админке, используем пустой массив
  return { data: [] as CourseUI[], loading: false, error: null };
}

export function useEvents() {
  // Мероприятия пока не в админке, используем пустой массив
  return { data: [] as EventUI[], loading: false, error: null };
}

export function useRooms() {
  return useDataFetch<RoomUI[]>('rooms', EMPTY_ARRAY);
}

export function usePackages() {
  return useDataFetch<PackageUI[]>('packages', EMPTY_ARRAY);
}

export function useMasters() {
  return useDataFetch<MasterUI[]>('masters', EMPTY_ARRAY);
}

export function useGallery() {
  return useDataFetch<GalleryItemUI[]>('gallery', EMPTY_ARRAY);
}

export function useServices() {
  return useDataFetch<ServiceUI[]>('services', EMPTY_ARRAY);
}

export function useFAQ(zone: 'creativity' | 'hotel') {
  // FAQ - статические данные
  const faqData = zone === 'creativity' ? FAQ_CREATIVITY : FAQ_HOTEL;
  return { data: faqData, loading: false, error: null };
}

export interface ReviewUI {
  id: string;
  author: string;
  text: string;
  rating: number;
  zone: 'creativity' | 'hotel';
  source: 'google' | '2gis' | 'instagram' | 'direct';
  date?: string;
  active?: boolean;
}

export function useReviews() {
  return useDataFetch<ReviewUI[]>('reviews', EMPTY_ARRAY);
}

export interface EventUI {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  image: string;
  location: string;
  type: 'masterclass' | 'holiday' | 'exhibition' | 'other';
  active?: boolean;
}

export function useAfisha() {
  return useDataFetch<EventUI[]>('afisha', EMPTY_ARRAY);
}

export interface HistoryItemUI {
  id: string;
  year: number;
  month: string;
  title: string;
  description: string;
  image: string;
  milestone: 'founding' | 'achievement' | 'expansion' | 'award' | 'event';
  active?: boolean;
}

export function useHistory() {
  return useDataFetch<HistoryItemUI[]>('history', EMPTY_ARRAY);
}

export interface SettingsUI {
  siteName?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  workingHours?: string;
  social?: {
    instagram?: string;
    facebook?: string;
    telegram?: string;
  };
  cinemaPrice?: number;
  galleryCategories?: { value: string; label: string }[];
  advantages?: { icon: string; title: string; description: string }[];
  whatYouGet?: { icon: string; title: string; description: string }[];
}

const EMPTY_SETTINGS: SettingsUI = {};

export function useSettings() {
  return useDataFetch<SettingsUI>('settings', EMPTY_SETTINGS);
}
