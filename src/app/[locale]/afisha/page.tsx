'use client';

import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useZone } from '@/contexts/ZoneContext';
import { useAfisha, EventUI } from '@/hooks/useSanityData';
import { Calendar, Clock, MapPin } from 'lucide-react';

import { Footer } from '@/components/layout/Footer';
import { FadeInOnScroll } from '@/components/animations/OptimizedAnimations';

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

function isUpcoming(dateString: string): boolean {
  const eventDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate >= today;
}

export default function AfishaPage() {
  const { setZone } = useZone();
  const { data: events, loading } = useAfisha();

  useEffect(() => {
    setZone('creativity');
  }, [setZone]);

  // Разделяем и сортируем события
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const activeEvents = events.filter(e => e.active !== false);

    const upcoming: EventUI[] = [];
    const past: EventUI[] = [];

    activeEvents.forEach(event => {
      if (isUpcoming(event.date)) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    });

    // Грядущие: ближайшие сначала (по возрастанию даты)
    upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Прошедшие: недавние сначала (по убыванию даты)
    past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  return (
    <>
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <span className="text-zone-500 text-sm font-medium tracking-wider uppercase">
                События
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-semibold mt-4 mb-4">
                Афиша
              </h1>
              <p className="text-neutral-500 max-w-2xl mx-auto">
                Предстоящие мероприятия, праздники и мастер-классы в Skeramos
              </p>
            </div>
          </FadeInOnScroll>

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
          ) : upcomingEvents.length === 0 && pastEvents.length === 0 ? (
            /* Empty state */
            <div className="text-center py-16">
              <span className="text-6xl mb-4 block">📅</span>
              <h3 className="text-xl font-semibold mb-2">Пока нет событий</h3>
              <p className="text-neutral-500">
                Следите за обновлениями! Скоро мы добавим новые мероприятия.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <section>
                  <h2 className="text-2xl md:text-3xl font-display font-medium text-neutral-800 mb-8 flex items-center gap-3">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    Грядущие события
                  </h2>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {upcomingEvents.map((event) => (
                      <EventCard key={event.id} event={event} isUpcoming />
                    ))}
                  </motion.div>
                </section>
              )}

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <section>
                  <h2 className="text-2xl md:text-3xl font-display font-medium text-neutral-500 mb-8 flex items-center gap-3">
                    <span className="w-3 h-3 bg-neutral-400 rounded-full"></span>
                    Прошедшие события
                  </h2>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {pastEvents.map((event) => (
                      <EventCard key={event.id} event={event} isUpcoming={false} />
                    ))}
                  </motion.div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

// Event Card Component
function EventCard({ event, isUpcoming }: { event: EventUI; isUpcoming: boolean }) {
  return (
    <motion.div
      variants={fadeInUp}
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
            {event.type === 'masterclass' && 'Мастер-класс'}
            {event.type === 'holiday' && 'Праздник'}
            {event.type === 'exhibition' && 'Выставка'}
            {event.type === 'other' && 'Событие'}
          </span>
          {!isUpcoming && (
            <span className="px-3 py-1 rounded-full text-xs font-medium text-white bg-neutral-500">
              Завершено
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
