'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useZone } from '@/contexts/ZoneContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FadeInOnScroll } from '@/components/animations/OptimizedAnimations';
import { FadeIn, Parallax, StaggerContainer, StaggerItem } from '@/components/animations/ScrollAnimations';
import { EtnoPatternOverlay, GlowingAccent, SectionDivider } from '@/components/animations/EtnoDecorations';

// Mock data - будет из Sanity
const ROOMS = [
  {
    id: '1',
    slug: 'standard',
    title: 'Стандартный номер',
    description: 'Уютный номер для комфортного отдыха. Идеально подходит для одного или двух гостей.',
    longDescription: 'Номер оснащён всем необходимым для комфортного пребывания: удобная двуспальная кровать, рабочий стол, шкаф для одежды. Из окна открывается вид на тихий двор.',
    price: 3500,
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
    ],
    capacity: 2,
    size: 18,
    amenities: [
      { icon: '🛏️', label: 'Двуспальная кровать' },
      { icon: '📶', label: 'Бесплатный Wi-Fi' },
      { icon: '❄️', label: 'Кондиционер' },
      { icon: '📺', label: 'Smart TV' },
      { icon: '🚿', label: 'Душевая кабина' },
      { icon: '☕', label: 'Чай и кофе' },
    ],
  },
  {
    id: '2',
    slug: 'comfort',
    title: 'Комфорт',
    description: 'Просторный номер с дополнительными удобствами. Отличный выбор для пар.',
    longDescription: 'Номер повышенной комфортности с большой кроватью king-size, мягким креслом для отдыха и просторной ванной комнатой. Панорамные окна наполняют пространство светом.',
    price: 5000,
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    ],
    capacity: 2,
    size: 25,
    amenities: [
      { icon: '🛏️', label: 'Кровать King-size' },
      { icon: '📶', label: 'Бесплатный Wi-Fi' },
      { icon: '❄️', label: 'Кондиционер' },
      { icon: '📺', label: 'Smart TV 55"' },
      { icon: '🛁', label: 'Ванна' },
      { icon: '☕', label: 'Мини-бар' },
      { icon: '🧴', label: 'Премиум косметика' },
    ],
  },
  {
    id: '3',
    slug: 'romantic',
    title: 'Романтический люкс',
    description: 'Роскошный номер для особых случаев. Идеален для романтического уикенда.',
    longDescription: 'Эксклюзивный номер с джакузи, камином и панорамным видом. Романтическая атмосфера создаётся приглушённым освещением, свечами и лепестками роз по запросу.',
    price: 8000,
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
    ],
    capacity: 2,
    size: 35,
    amenities: [
      { icon: '🛏️', label: 'Кровать King-size' },
      { icon: '🛁', label: 'Джакузи' },
      { icon: '🔥', label: 'Камин' },
      { icon: '🥂', label: 'Шампанское' },
      { icon: '📺', label: 'Smart TV 65"' },
      { icon: '🌅', label: 'Панорамный вид' },
      { icon: '☕', label: 'Мини-бар' },
      { icon: '🧴', label: 'Люкс косметика' },
    ],
    featured: true,
  },
];

function getWhatsAppLink(roomName: string): string {
  const phone = '996555123456';
  const message = encodeURIComponent(`Здравствуйте! Хочу забронировать номер "${roomName}"`);
  return `https://wa.me/${phone}?text=${message}`;
}

// Компонент карточки номера с параллаксом
function RoomCard({ room, index }: { room: typeof ROOMS[0]; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start']
  });

  // Параллакс для изображения
  const imageY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.5]);
  const contentX = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [index % 2 === 0 ? 50 : -50, 0, 0, index % 2 === 0 ? -50 : 50]
  );

  return (
    <motion.article
      ref={cardRef}
      className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
        index % 2 === 1 ? 'lg:flex-row-reverse' : ''
      }`}
      style={{ opacity: contentOpacity }}
    >
      {/* Images with Parallax */}
      <div className={`relative group ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
          <motion.div
            className="absolute inset-0 scale-110"
            style={{ y: imageY }}
          >
            <Image
              src={room.images[0]}
              alt={room.title}
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {room.featured && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-4 left-4 px-4 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-white text-sm font-medium shadow-lg"
            >
              Рекомендуем
            </motion.div>
          )}

          {/* Price badge on hover */}
          <motion.div
            className="absolute bottom-4 right-4 px-4 py-2 glass rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <span className="text-2xl font-bold text-white">{room.price.toLocaleString()}</span>
            <span className="text-neutral-300 text-sm ml-1">сом/ночь</span>
          </motion.div>
        </div>

        {/* Decorative floating frame */}
        <Parallax speed={-0.3} offset={30}>
          <div className="absolute -bottom-6 -right-6 w-40 h-32 rounded-2xl overflow-hidden border-4 border-background shadow-2xl hidden md:block">
            <Image
              src={room.images[1]}
              alt={room.title}
              fill
              className="object-cover"
            />
          </div>
        </Parallax>

        {/* Decorative corner element */}
        <div className="absolute -top-3 -left-3 w-12 h-12 border-l-2 border-t-2 border-zone-500/30 rounded-tl-2xl" />
        <div className="absolute -bottom-3 -right-3 w-12 h-12 border-r-2 border-b-2 border-zone-500/30 rounded-br-2xl" />
      </div>

      {/* Content with animation */}
      <motion.div
        className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}
        style={{ x: contentX }}
      >
        <FadeIn direction={index % 2 === 0 ? 'left' : 'right'}>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-4xl md:text-5xl font-display font-bold text-zone-400">
              {room.price.toLocaleString()}
            </span>
            <span className="text-neutral-500 text-lg">сом/ночь</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-4">
            {room.title}
          </h2>

          <p className="text-neutral-300 text-lg mb-6 leading-relaxed">
            {room.longDescription}
          </p>

          {/* Room specs with icons */}
          <div className="flex gap-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-zone-500/20 flex items-center justify-center text-xl">
                👥
              </div>
              <div>
                <div className="text-white font-medium">до {room.capacity}</div>
                <div className="text-sm text-neutral-500">гостей</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-zone-500/20 flex items-center justify-center text-xl">
                📐
              </div>
              <div>
                <div className="text-white font-medium">{room.size} м²</div>
                <div className="text-sm text-neutral-500">площадь</div>
              </div>
            </div>
          </div>

          {/* Amenities grid */}
          <StaggerContainer staggerDelay={0.05} className="flex flex-wrap gap-2 mb-8">
            {room.amenities.map((amenity, idx) => (
              <StaggerItem key={idx}>
                <span className="px-4 py-2 rounded-xl glass text-sm text-neutral-300 hover:bg-white/10 transition-colors cursor-default">
                  {amenity.icon} {amenity.label}
                </span>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* CTA */}
          <motion.a
            href={getWhatsAppLink(room.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-zone-500 hover:bg-zone-600 text-white rounded-2xl font-medium transition-all shadow-lg shadow-zone-500/20"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Забронировать
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </motion.a>
        </FadeIn>
      </motion.div>
    </motion.article>
  );
}

export default function RoomsPage() {
  const { setZone } = useZone();
  const locale = useLocale();

  useEffect(() => {
    setZone('hotel');
  }, [setZone]);

  return (
    <>
      <Header />
      <EtnoPatternOverlay pattern="tunduk" opacity={0.02} />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <GlowingAccent position="top-right" zone="hotel" size={600} />

          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-3xl mx-auto text-center">
              <Link
                href={`/${locale}/hotel`}
                className="inline-flex items-center gap-2 text-zone-400 hover:text-zone-300 transition-colors mb-6"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад к отелю
              </Link>
              <h1 className="text-4xl md:text-6xl font-display font-medium text-white mb-6">
                Наши{' '}
                <span className="bg-gradient-to-r from-zone-300 to-gold-500 bg-clip-text text-transparent">
                  номера
                </span>
              </h1>
              <p className="text-lg text-neutral-300">
                Выберите идеальный номер для вашего отдыха. От уютного стандарта до роскошного люкса.
              </p>
            </FadeInOnScroll>
          </div>
        </section>

        <SectionDivider variant="diamond" className="opacity-50" />

        {/* Rooms Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="space-y-24">
              {ROOMS.map((room, index) => (
                <RoomCard key={room.id} room={room} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Amenities Section */}
        <section className="py-16 md:py-24 bg-zone-950/50 etno-shyrdak relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-zone-500" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-zone-500" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-zone-500" />
          </div>

          <div className="container mx-auto px-4 relative">
            <FadeIn className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-4">
                Во всех номерах
              </h2>
              <p className="text-neutral-400">Базовые удобства для вашего комфорта</p>
            </FadeIn>

            <StaggerContainer staggerDelay={0.05} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {[
                { icon: '📶', label: 'Wi-Fi' },
                { icon: '❄️', label: 'Кондиционер' },
                { icon: '📺', label: 'Smart TV' },
                { icon: '🚿', label: 'Душ' },
                { icon: '☕', label: 'Чай/кофе' },
                { icon: '🧴', label: 'Косметика' },
                { icon: '🛎️', label: '24/7 ресепшн' },
                { icon: '🚗', label: 'Парковка' },
                { icon: '🧹', label: 'Уборка' },
                { icon: '👔', label: 'Утюг' },
                { icon: '💇', label: 'Фен' },
                { icon: '🔒', label: 'Сейф' },
              ].map((item, idx) => (
                <StaggerItem key={idx}>
                  <motion.div
                    className="glass-card p-6 text-center hover:bg-white/10 transition-colors cursor-default"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <span className="text-3xl mb-3 block">{item.icon}</span>
                    <span className="text-sm text-neutral-300 font-medium">{item.label}</span>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-6">
                Не нашли подходящий вариант?
              </h2>
              <p className="text-neutral-300 mb-8">
                Свяжитесь с нами, и мы поможем подобрать идеальный номер под ваши пожелания
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="tel:+996555123456"
                  className="px-6 py-3 bg-zone-500 hover:bg-zone-600 text-white rounded-xl font-medium transition-colors"
                >
                  Позвонить
                </a>
                <Link
                  href={`/${locale}/hotel/packages`}
                  className="px-6 py-3 glass hover:bg-white/10 text-white rounded-xl font-medium transition-colors"
                >
                  Смотреть пакеты
                </Link>
              </div>
            </FadeInOnScroll>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
