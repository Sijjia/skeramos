'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useZone } from '@/contexts/ZoneContext';
import {
  Wifi, Coffee, Tv, BookOpen, Car, UtensilsCrossed,
  Shirt, Clock, Shield, Sparkles
} from 'lucide-react';

import { Footer } from '@/components/layout/Footer';
import { FadeInOnScroll } from '@/components/animations/OptimizedAnimations';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

// Mock data - будет из Sanity/админки
const SERVICES = [
  {
    Icon: Wifi,
    title: 'Бесплатный Wi-Fi',
    description: 'Высокоскоростной интернет во всех номерах и общих зонах',
    included: true,
  },
  {
    Icon: UtensilsCrossed,
    title: 'Завтрак',
    description: 'Континентальный завтрак с 8:00 до 10:00',
    included: true,
  },
  {
    Icon: Coffee,
    title: 'Чай и кофе',
    description: 'Чайная станция в номере с чаем, кофе и печеньем',
    included: true,
  },
  {
    Icon: Car,
    title: 'Парковка',
    description: 'Охраняемая парковка на территории',
    included: true,
  },
  {
    Icon: Tv,
    title: 'Кинозал',
    description: 'Приватный кинозал с проектором 4K и системой Dolby',
    included: false,
    price: '2000 сом/час',
  },
  {
    Icon: BookOpen,
    title: 'Библиотека',
    description: 'Коллекция книг по искусству и керамике',
    included: true,
  },
  {
    Icon: Shirt,
    title: 'Прачечная',
    description: 'Услуги стирки и глажки',
    included: false,
    price: 'от 500 сом',
  },
  {
    Icon: Clock,
    title: 'Ранний заезд / Поздний выезд',
    description: 'Гибкое время заезда и выезда по договорённости',
    included: false,
    price: 'от 1000 сом',
  },
  {
    Icon: Shield,
    title: 'Сейф в номере',
    description: 'Индивидуальный сейф для ценных вещей',
    included: true,
  },
  {
    Icon: Sparkles,
    title: 'Романтический декор',
    description: 'Украшение номера лепестками, свечами и шарами',
    included: false,
    price: 'от 3000 сом',
  },
];

export default function AdditionalServicesPage() {
  const { zone, setZone } = useZone();

  useEffect(() => {
    // Не меняем зону, страница общая
  }, []);

  const includedServices = SERVICES.filter(s => s.included);
  const paidServices = SERVICES.filter(s => !s.included);

  return (
    <>
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <span className="text-zone-500 text-sm font-medium tracking-wider uppercase">
                Сервис
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-semibold mt-4 mb-4">
                Дополнительные услуги
              </h1>
              <p className="text-neutral-500 max-w-2xl mx-auto">
                Всё для вашего комфортного пребывания
              </p>
            </div>
          </FadeInOnScroll>

          {/* Included Services */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-center">
              Бесплатно для гостей
            </h2>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {includedServices.map((service) => (
                <motion.div
                  key={service.title}
                  variants={fadeInUp}
                  className="glass-card p-6 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-zone-500/10 flex items-center justify-center flex-shrink-0">
                    <service.Icon className="w-6 h-6 text-zone-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{service.title}</h3>
                    <p className="text-sm text-neutral-500">{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Paid Services */}
          <section>
            <h2 className="text-2xl font-semibold mb-8 text-center">
              Дополнительно
            </h2>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {paidServices.map((service) => (
                <motion.div
                  key={service.title}
                  variants={fadeInUp}
                  className="glass-card p-6 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-zone-500/10 flex items-center justify-center flex-shrink-0">
                    <service.Icon className="w-6 h-6 text-zone-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{service.title}</h3>
                    <p className="text-sm text-neutral-500 mb-2">{service.description}</p>
                    <span className="text-zone-500 font-medium text-sm">
                      {service.price}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
