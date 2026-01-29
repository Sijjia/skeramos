'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useZone } from '@/contexts/ZoneContext';
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

// Mock data - будет из Sanity/админки
const EVENTS = [
  {
    id: 1,
    title: 'Мастер-класс "Весенние вазы"',
    description: 'Создаём вазы с весенними мотивами. Идеально для подарка к 8 марта!',
    date: '2026-03-01',
    time: '14:00 - 17:00',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
    location: 'Skeramos, ул. Шукурова 8',
    type: 'masterclass',
  },
  {
    id: 2,
    title: 'Наурыз в Skeramos',
    description: 'Праздничная программа: традиционная керамика, музыка и угощения.',
    date: '2026-03-21',
    time: '12:00 - 20:00',
    image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=600&q=80',
    location: 'Skeramos, ул. Шукурова 8',
    type: 'holiday',
  },
  {
    id: 3,
    title: 'Выставка работ учеников',
    description: 'Лучшие работы наших учеников за 2025 год. Вход свободный.',
    date: '2026-04-15',
    time: '10:00 - 18:00',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=80',
    location: 'Skeramos, ул. Шукурова 8',
    type: 'exhibition',
  },
];

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

  useEffect(() => {
    setZone('creativity');
  }, [setZone]);

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

          {/* Events Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {EVENTS.map((event) => (
              <motion.div
                key={event.id}
                variants={fadeInUp}
                className="glass-card overflow-hidden group"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium text-white
                      ${event.type === 'masterclass' ? 'bg-zone-500' : ''}
                      ${event.type === 'holiday' ? 'bg-amber-500' : ''}
                      ${event.type === 'exhibition' ? 'bg-purple-500' : ''}
                    `}>
                      {event.type === 'masterclass' && 'Мастер-класс'}
                      {event.type === 'holiday' && 'Праздник'}
                      {event.type === 'exhibition' && 'Выставка'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
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

          {/* Empty state placeholder */}
          {EVENTS.length === 0 && (
            <div className="text-center py-16">
              <p className="text-neutral-500">
                Пока нет предстоящих событий. Следите за обновлениями!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
