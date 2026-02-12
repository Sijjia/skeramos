'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useZone } from '@/contexts/ZoneContext';
import { useAfisha, EventUI } from '@/hooks/useSanityData';
import { Calendar, Clock, MapPin } from 'lucide-react';

import { Footer } from '@/components/layout/Footer';
import { FadeInOnScroll } from '@/components/animations/OptimizedAnimations';

type FilterType = 'all' | 'upcoming' | 'past';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function isUpcomingEvent(dateString: string): boolean {
  const eventDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate >= today;
}

export default function AfishaPage() {
  const { setZone } = useZone();
  const locale = useLocale();
  const t = useTranslations('afisha');
  const { data: events, loading } = useAfisha();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    setZone('creativity');
  }, [setZone]);

  // Разделяем и сортируем события
  const { allEvents, upcomingEvents, pastEvents } = useMemo(() => {
    const activeEvents = events.filter(e => e.active !== false);

    const upcoming: EventUI[] = [];
    const past: EventUI[] = [];

    activeEvents.forEach(event => {
      if (isUpcomingEvent(event.date)) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    });

    // Грядущие: ближайшие сначала (по возрастанию даты)
    upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Прошедшие: недавние сначала (по убыванию даты)
    past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Все: сначала грядущие, потом прошедшие
    const all = [...upcoming, ...past];

    return { allEvents: all, upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  // Получаем отфильтрованные события
  const filteredEvents = useMemo(() => {
    switch (activeFilter) {
      case 'upcoming':
        return upcomingEvents;
      case 'past':
        return pastEvents;
      default:
        return allEvents;
    }
  }, [activeFilter, allEvents, upcomingEvents, pastEvents]);

  return (
    <>
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <span className="text-zone-500 text-sm font-medium tracking-wider uppercase">
                {t('badge')}
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-semibold mt-4 mb-4">
                {t('title')}
              </h1>
              <p className="text-neutral-500 max-w-2xl mx-auto">
                {t('subtitle')}
              </p>
            </div>
          </FadeInOnScroll>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
            <button
              onClick={() => setActiveFilter('all')}
              className={`
                px-4 py-2 md:px-6 md:py-3 rounded-xl text-sm font-medium transition-all duration-300
                ${activeFilter === 'all'
                  ? 'bg-zone-500 text-white shadow-lg shadow-zone-500/30'
                  : 'glass text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
                }
              `}
            >
              <span className="mr-2">✨</span>
              {t('allEvents')}
              {allEvents.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                  {allEvents.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveFilter('upcoming')}
              className={`
                px-4 py-2 md:px-6 md:py-3 rounded-xl text-sm font-medium transition-all duration-300
                ${activeFilter === 'upcoming'
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                  : 'glass text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
                }
              `}
            >
              <span className="mr-2">🔥</span>
              {t('upcoming')}
              {upcomingEvents.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                  {upcomingEvents.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveFilter('past')}
              className={`
                px-4 py-2 md:px-6 md:py-3 rounded-xl text-sm font-medium transition-all duration-300
                ${activeFilter === 'past'
                  ? 'bg-neutral-500 text-white shadow-lg shadow-neutral-500/30'
                  : 'glass text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
                }
              `}
            >
              <span className="mr-2">📜</span>
              {t('past')}
              {pastEvents.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                  {pastEvents.length}
                </span>
              )}
            </button>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card overflow-hidden animate-pulse">
                  <div className="aspect-[16/10] bg-white/10"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-white/10 rounded w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded w-full"></div>
                    <div className="h-4 bg-white/10 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            /* Empty state */
            <div className="text-center py-16">
              <span className="text-6xl mb-4 block">📅</span>
              <h3 className="text-xl font-semibold mb-2">
                {activeFilter === 'upcoming' && t('noUpcoming')}
                {activeFilter === 'past' && t('noPast')}
                {activeFilter === 'all' && t('noEvents')}
              </h3>
              <p className="text-neutral-500">
                {t('followUpdates')}
              </p>
            </div>
          ) : (
            /* Events Grid */
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isUpcoming={isUpcomingEvent(event.date)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

// Event Card Component
function EventCard({ event, isUpcoming }: { event: EventUI; isUpcoming: boolean }) {
  const t = useTranslations('afisha');
  return (
    <motion.div
      layout
      variants={fadeInUp}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`glass-card overflow-hidden group ${!isUpcoming ? 'opacity-75' : ''}`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${!isUpcoming ? 'grayscale-[30%]' : ''}`}
          />
        ) : (
          <div className="w-full h-full bg-zone-500/20 flex items-center justify-center">
            <span className="text-4xl">📅</span>
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`
            px-3 py-1 rounded-full text-xs font-medium text-white
            ${event.type === 'masterclass' ? 'bg-zone-500' : ''}
            ${event.type === 'holiday' ? 'bg-amber-500' : ''}
            ${event.type === 'exhibition' ? 'bg-purple-500' : ''}
            ${event.type === 'other' ? 'bg-blue-500' : ''}
          `}>
            {event.type === 'masterclass' && t('masterclass')}
            {event.type === 'holiday' && t('holiday')}
            {event.type === 'exhibition' && t('exhibition')}
            {event.type === 'other' && t('event')}
          </span>
          {!isUpcoming && (
            <span className="px-3 py-1 rounded-full text-xs font-medium text-white bg-neutral-500">
              {t('finished')}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 card-title">
          {event.title}
        </h3>
        <p className="text-neutral-500 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 text-sm text-neutral-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zone-500" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-zone-500" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-zone-500" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
