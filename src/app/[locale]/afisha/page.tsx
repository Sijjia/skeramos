'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useZone } from '@/contexts/ZoneContext';
import { useAfisha } from '@/hooks/useSanityData';
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

export default function AfishaPage() {
  const { setZone } = useZone();
  const { data: events, loading } = useAfisha();

  useEffect(() => {
    setZone('creativity');
  }, [setZone]);

  // Фильтруем только активные события
  const activeEvents = events.filter(e => e.active !== false);

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
          ) : activeEvents.length > 0 ? (
            /* Events Grid */
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {activeEvents.map((event) => (
                <motion.div
                  key={event.id}
                  variants={fadeInUp}
                  className="glass-card overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-zone-500/20 flex items-center justify-center">
                        <span className="text-4xl">📅</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
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
              ))}
            </motion.div>
          ) : (
            /* Empty state */
            <div className="text-center py-16">
              <span className="text-6xl mb-4 block">📅</span>
              <h3 className="text-xl font-semibold mb-2">Пока нет предстоящих событий</h3>
              <p className="text-neutral-500">
                Следите за обновлениями! Скоро мы добавим новые мероприятия.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
