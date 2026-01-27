'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useZone } from '@/contexts/ZoneContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FadeInOnScroll } from '@/components/animations/OptimizedAnimations';
import { EtnoPatternOverlay, GlowingAccent, SectionDivider } from '@/components/animations/EtnoDecorations';

// Mock data - будет из Sanity
const ALL_SERVICES = [
  {
    id: '1',
    slug: 'pottery-wheel-intro',
    title: 'Знакомство с гончарным кругом',
    shortDescription: 'Первый шаг в мир керамики. Создайте свою первую чашу или вазу.',
    fullDescription: 'Идеальный мастер-класс для новичков! Вы познакомитесь с гончарным кругом, научитесь центровать глину и создадите своё первое изделие. Мастер поможет на каждом этапе — от подготовки глины до формирования стенок. В конце занятия вы выберете глазурь для обжига.',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
    price: 2500,
    duration: '2 часа',
    groupSize: '1-4 человека',
    includes: ['Все материалы', 'Работа мастера', 'Обжиг изделия', 'Упаковка'],
    category: 'masterclass',
  },
  {
    id: '2',
    slug: 'hand-building',
    title: 'Лепка из пласта',
    shortDescription: 'Освойте технику ручной лепки и создайте уникальную тарелку.',
    fullDescription: 'На этом мастер-классе вы освоите технику работы с глиняным пластом. Научитесь раскатывать глину, вырезать формы и собирать изделие. Создадите авторскую тарелку или блюдо с декором по вашему выбору.',
    image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&q=80',
    price: 2800,
    duration: '2.5 часа',
    groupSize: '1-6 человек',
    includes: ['Все материалы', 'Работа мастера', 'Обжиг', 'Декорирование'],
    category: 'masterclass',
  },
  {
    id: '3',
    slug: 'painting',
    title: 'Роспись керамики',
    shortDescription: 'Украсьте готовое изделие глазурью и ангобами.',
    fullDescription: 'Идеальный вариант для тех, кто хочет творить без работы с глиной. Вы получите готовое бисквитное изделие и распишете его специальными красками. Узнаете о техниках росписи, смешивании цветов и создании орнаментов.',
    image: 'https://images.unsplash.com/photo-1603665301175-57ba46f392bf?w=800&q=80',
    price: 2000,
    duration: '1.5 часа',
    groupSize: '1-8 человек',
    includes: ['Изделие для росписи', 'Краски и кисти', 'Глазурь', 'Обжиг'],
    category: 'masterclass',
  },
  {
    id: '4',
    slug: 'couple-pottery',
    title: 'Свидание на гончарном круге',
    shortDescription: 'Романтический мастер-класс для пар.',
    fullDescription: 'Проведите незабываемое свидание за гончарным кругом! Вы с партнёром будете работать на соседних кругах, помогая друг другу. Создадите парные изделия — например, набор чашек. Романтическая атмосфера и памятные сувениры гарантированы.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
    price: 5500,
    duration: '2 часа',
    groupSize: '2 человека',
    includes: ['Отдельные круги', 'Все материалы', 'Чай и сладости', 'Фотосессия'],
    category: 'masterclass',
  },
  {
    id: '5',
    slug: 'basic-course',
    title: 'Базовый курс гончарного мастерства',
    shortDescription: 'Полный курс для начинающих: от центровки до обжига.',
    fullDescription: '8 занятий по 3 часа — полное погружение в гончарное искусство. Вы освоите все базовые техники: центровку, вытягивание стенок, формирование разных изделий. Узнаете о типах глины, глазурях и обжиге. К концу курса создадите целую коллекцию!',
    image: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=800&q=80',
    price: 35000,
    duration: '8 занятий × 3 часа',
    groupSize: '4-6 человек',
    includes: ['24 часа обучения', 'Все материалы', '8+ изделий', 'Сертификат'],
    category: 'course',
  },
  {
    id: '6',
    slug: 'teambuilding',
    title: 'Корпоративный тимбилдинг',
    shortDescription: 'Объедините команду за творческим процессом.',
    fullDescription: 'Уникальный формат тимбилдинга! Ваша команда будет работать вместе над керамическими проектами. Можно создать общее панно или индивидуальные изделия. Мы подготовим программу под ваши задачи и количество участников.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    price: 3000,
    priceNote: 'за человека',
    duration: '3 часа',
    groupSize: 'до 20 человек',
    includes: ['Индивидуальная программа', 'Все материалы', 'Фотоотчёт', 'Кофе-брейк'],
    category: 'event',
  },
  {
    id: '7',
    slug: 'birthday',
    title: 'День рождения в мастерской',
    shortDescription: 'Незабываемый праздник для детей и взрослых.',
    fullDescription: 'Отметьте день рождения творчески! Мы организуем мастер-класс для именинника и гостей, украсим зал, подготовим зону для чаепития. Каждый гость создаст подарок для именинника, а он сам — особенное изделие.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80',
    price: 25000,
    priceNote: 'от',
    duration: '2.5 часа',
    groupSize: 'до 12 человек',
    includes: ['Мастер-класс', 'Украшение зала', 'Чаепитие', 'Фото'],
    category: 'event',
  },
  {
    id: '8',
    slug: 'bachelorette',
    title: 'Девичник в мастерской',
    shortDescription: 'Творческое время с подругами.',
    fullDescription: 'Проведите девичник с пользой! Создайте керамику, которая напомнит о весёлом дне. Мы подготовим особую программу, украсим пространство и обеспечим фотозону. Можно добавить шампанское и закуски.',
    image: 'https://images.unsplash.com/photo-1529543544277-750e1b25e5f4?w=800&q=80',
    price: 20000,
    priceNote: 'от',
    duration: '2.5 часа',
    groupSize: 'до 8 человек',
    includes: ['Мастер-класс', 'Декор и фотозона', 'Напитки', 'Сувениры'],
    category: 'event',
  },
];

const ITEMS_PER_PAGE = 8;

export default function ServicesPage() {
  const { setZone } = useZone();
  const locale = useLocale();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'telegram' | 'phone' | null>(null);

  useEffect(() => {
    setZone('creativity');
  }, [setZone]);

  const totalPages = Math.ceil(ALL_SERVICES.length / ITEMS_PER_PAGE);
  const paginatedServices = ALL_SERVICES.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const selectedServiceData = ALL_SERVICES.find(s => s.id === selectedService);

  const getContactLink = (service: typeof ALL_SERVICES[0], method: 'whatsapp' | 'telegram' | 'phone') => {
    const message = encodeURIComponent(`Здравствуйте! Хочу записаться на "${service.title}"`);
    switch (method) {
      case 'whatsapp':
        return `https://wa.me/996555123456?text=${message}`;
      case 'telegram':
        return `https://t.me/skeramos?text=${message}`;
      case 'phone':
        return 'tel:+996555123456';
    }
  };

  return (
    <>
      <Header />
      <EtnoPatternOverlay pattern="mixed" opacity={0.02} />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <GlowingAccent position="top-right" zone="creativity" size={500} />

          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-2 rounded-full glass text-sm text-zone-300 font-medium mb-6">
                Мастер-классы и мероприятия
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-medium text-white mb-6">
                Все{' '}
                <span className="bg-gradient-to-r from-zone-300 to-gold-500 bg-clip-text text-transparent">
                  услуги
                </span>
              </h1>
              <p className="text-lg text-neutral-300">
                Выберите формат, который подходит именно вам — от первого знакомства с керамикой
                до профессиональных курсов и корпоративных мероприятий.
              </p>
            </FadeInOnScroll>
          </div>
        </section>

        <SectionDivider variant="wave" className="opacity-50" />

        {/* Services List */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="space-y-16">
              {paginatedServices.map((service, index) => (
                <FadeInOnScroll
                  key={service.id}
                  direction={index % 2 === 0 ? 'left' : 'right'}
                  delay={0.1}
                >
                  <article
                    className={`grid md:grid-cols-2 gap-8 items-center ${
                      index % 2 === 1 ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Image - чередование лево/право */}
                    <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                      <div className="relative aspect-[4/3] rounded-3xl overflow-hidden group">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

                        {/* Price badge */}
                        <div className="absolute top-4 right-4 px-4 py-2 rounded-full glass">
                          <span className="text-white font-medium">
                            {service.priceNote && `${service.priceNote} `}
                            {service.price.toLocaleString()} сом
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                      <span className="text-zone-400 text-sm font-medium tracking-wider uppercase">
                        {service.category === 'masterclass' && 'Мастер-класс'}
                        {service.category === 'course' && 'Курс'}
                        {service.category === 'event' && 'Мероприятие'}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-display font-medium text-white mt-2 mb-4">
                        {service.title}
                      </h2>
                      <p className="text-neutral-300 mb-6">
                        {service.shortDescription}
                      </p>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-4 text-sm text-neutral-400 mb-6">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {service.duration}
                        </span>
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {service.groupSize}
                        </span>
                      </div>

                      {/* Includes */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {service.includes.slice(0, 3).map((item) => (
                          <span
                            key={item}
                            className="px-3 py-1 rounded-full bg-zone-900/50 text-zone-300 text-sm"
                          >
                            {item}
                          </span>
                        ))}
                        {service.includes.length > 3 && (
                          <span className="px-3 py-1 rounded-full bg-zone-900/50 text-zone-400 text-sm">
                            +{service.includes.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => setSelectedService(service.id)}
                          className="px-6 py-3 bg-zone-500 hover:bg-zone-600 text-white rounded-xl font-medium transition-all"
                        >
                          Записаться
                        </button>
                        <Link
                          href={`/${locale}/services/${service.slug}`}
                          className="px-6 py-3 glass hover:bg-white/10 text-white rounded-xl font-medium transition-all"
                        >
                          Подробнее
                        </Link>
                      </div>
                    </div>
                  </article>
                </FadeInOnScroll>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 glass rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      page === currentPage
                        ? 'bg-zone-500 text-white'
                        : 'glass hover:bg-white/10 text-neutral-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 glass rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Contact Modal */}
        <AnimatePresence>
          {selectedService && selectedServiceData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm"
              onClick={() => {
                setSelectedService(null);
                setContactMethod(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-md w-full glass-card p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setSelectedService(null);
                    setContactMethod(null);
                  }}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  ×
                </button>

                <h3 className="text-xl font-display font-medium text-white mb-2">
                  Записаться на
                </h3>
                <p className="text-zone-400 mb-6">{selectedServiceData.title}</p>

                <p className="text-neutral-300 text-sm mb-6">
                  Выберите удобный способ связи:
                </p>

                <div className="space-y-3">
                  <a
                    href={getContactLink(selectedServiceData, 'whatsapp')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 glass rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-medium">WhatsApp</div>
                      <div className="text-neutral-400 text-sm">Быстрый ответ</div>
                    </div>
                  </a>

                  <a
                    href={getContactLink(selectedServiceData, 'telegram')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 glass rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-medium">Telegram</div>
                      <div className="text-neutral-400 text-sm">Написать в чат</div>
                    </div>
                  </a>

                  <a
                    href={getContactLink(selectedServiceData, 'phone')}
                    className="flex items-center gap-4 p-4 glass rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 bg-zone-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-medium">Позвонить</div>
                      <div className="text-neutral-400 text-sm">+996 555 123 456</div>
                    </div>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );
}
