'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useZone } from '@/contexts/ZoneContext';

import { Footer } from '@/components/layout/Footer';
import { FadeInOnScroll } from '@/components/animations/OptimizedAnimations';
import { EtnoPatternOverlay, GlowingAccent, SectionDivider } from '@/components/animations/EtnoDecorations';

// Mock data - будет заменено на данные из Sanity
const MASTERS_DATA: Record<string, {
  name: string;
  role: string;
  photo: string;
  experience: string;
  specialization: string;
  bio: string;
  quote: string;
  achievements: { title: string; year: string }[];
  works: { id: string; title: string; image: string; description: string; technique: string; year: string }[];
}> = {
  'aigul-satarova': {
    name: 'Айгуль Сатарова',
    role: 'Основатель, мастер керамики',
    photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&q=80',
    experience: '15 лет опыта',
    specialization: 'Традиционная кыргызская керамика',
    bio: `Айгуль Сатарова — основатель и душа Skeramos. Её путь в керамике начался в детстве, когда бабушка показала ей, как из простой глины рождаются удивительные вещи.

После обучения в Бишкекском художественном училище Айгуль продолжила совершенствовать мастерство в России и Узбекистане, изучая как современные техники, так и древние традиции.

В 2019 году она открыла Skeramos с мечтой — создать пространство, где каждый может прикоснуться к магии гончарного искусства. Сегодня она обучает учеников и создаёт авторские работы, сочетающие кыргызские традиции с современной эстетикой.`,
    quote: 'Керамика — это медитация. Каждое изделие несёт частичку души мастера.',
    achievements: [
      { title: 'Основание студии Skeramos', year: '2019' },
      { title: 'Участие в выставке "Craft Bishkek"', year: '2021' },
      { title: 'Победитель конкурса "Золотые руки"', year: '2022' },
      { title: 'Мастер года по версии ArtKG', year: '2023' },
    ],
    works: [
      {
        id: '1',
        title: 'Ваза "Тянь-Шань"',
        image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
        description: 'Вдохновлена горными пейзажами Кыргызстана. Глазурь имитирует снежные вершины.',
        technique: 'Гончарный круг',
        year: '2023',
      },
      {
        id: '2',
        title: 'Набор "Кочевник"',
        image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=600&q=80',
        description: 'Набор посуды с традиционными кыргызскими орнаментами.',
        technique: 'Гончарный круг',
        year: '2023',
      },
      {
        id: '3',
        title: 'Пиала "Шырдак"',
        image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=600&q=80',
        description: 'Роспись вдохновлена узорами традиционного войлочного ковра.',
        technique: 'Роспись',
        year: '2022',
      },
      {
        id: '4',
        title: 'Кувшин "Иссык-Куль"',
        image: 'https://images.unsplash.com/photo-1605622371817-cc28e4a7dfc1?w=600&q=80',
        description: 'Синие оттенки глазури напоминают воды горного озера.',
        technique: 'Гончарный круг',
        year: '2022',
      },
    ],
  },
  'bakyt-toktogуlov': {
    name: 'Бакыт Токтогулов',
    role: 'Мастер гончарного круга',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    experience: '10 лет опыта',
    specialization: 'Современные техники',
    bio: `Бакыт пришёл в керамику необычным путём — он инженер по образованию. Именно техническое мышление помогает ему достигать идеальных форм и пропорций.

Его страсть — работа на гончарном круге. Он считает, что именно здесь, в непрерывном движении глины, рождается настоящая магия. Каждое изделие Бакыта отличается безупречной симметрией и современным минималистичным дизайном.

В Skeramos он ведёт мастер-классы по работе на круге и профессиональные курсы для тех, кто хочет освоить гончарное дело на профессиональном уровне.`,
    quote: 'На гончарном круге время останавливается.',
    achievements: [
      { title: 'Сертификат мастера-гончара', year: '2016' },
      { title: 'Обучение в Японии', year: '2018' },
      { title: 'Персональная выставка', year: '2021' },
    ],
    works: [
      {
        id: '1',
        title: 'Чайник "Минимал"',
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=80',
        description: 'Чистые линии и функциональность в японском стиле.',
        technique: 'Гончарный круг',
        year: '2023',
      },
      {
        id: '2',
        title: 'Набор чашек',
        image: 'https://images.unsplash.com/photo-1609686764508-e8e5d3a9c77a?w=600&q=80',
        description: 'Серия из 6 чашек с уникальной текстурой.',
        technique: 'Гончарный круг',
        year: '2023',
      },
    ],
  },
  'nurgul-asanova': {
    name: 'Нургуль Асанова',
    role: 'Художник по росписи',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    experience: '8 лет опыта',
    specialization: 'Авторская роспись',
    bio: `Нургуль — художник по образованию и по призванию. Она специализируется на росписи керамики, превращая простые изделия в произведения искусства.

Её стиль узнаваем — тонкие линии, богатая палитра и глубокое знание кыргызских орнаментов. Нургуль изучала традиционные узоры в музеях и экспедициях по регионам Кыргызстана.

В Skeramos она ведёт мастер-классы по росписи и создаёт авторские коллекции, которые пользуются большим спросом среди ценителей этнического искусства.`,
    quote: 'В каждом орнаменте — история нашего народа.',
    achievements: [
      { title: 'Диплом художника-декоратора', year: '2015' },
      { title: 'Коллекция "Наследие"', year: '2020' },
      { title: 'Сотрудничество с Национальным музеем', year: '2022' },
    ],
    works: [
      {
        id: '1',
        title: 'Блюдо "Тюндюк"',
        image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
        description: 'Декоративное блюдо с изображением солярного символа.',
        technique: 'Роспись',
        year: '2023',
      },
    ],
  },
};

export default function MasterDetailPage() {
  const { setZone } = useZone();
  const params = useParams();
  const locale = useLocale();
  const slug = params.slug as string;

  const [selectedWork, setSelectedWork] = useState<string | null>(null);

  const master = MASTERS_DATA[slug];

  useEffect(() => {
    setZone('creativity');
  }, [setZone]);

  if (!master) {
    return (
      <>
        
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl text-white mb-4">Мастер не найден</h1>
            <Link href={`/${locale}/masters`} className="text-zone-400 hover:underline">
              Вернуться к списку мастеров
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const selectedWorkData = master.works.find(w => w.id === selectedWork);

  return (
    <>
      
      <EtnoPatternOverlay pattern="shyrdak" opacity={0.02} />

      <main className="min-h-screen bg-background pt-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-neutral-400">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              Главная
            </Link>
            <span>/</span>
            <Link href={`/${locale}/masters`} className="hover:text-white transition-colors">
              Мастера
            </Link>
            <span>/</span>
            <span className="text-white">{master.name}</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Photo */}
              <FadeInOnScroll direction="left">
                <div className="relative">
                  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                    <Image
                      src={master.photo}
                      alt={master.name}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  </div>
                  <GlowingAccent position="top-left" zone="creativity" size={300} className="-z-10" />
                </div>
              </FadeInOnScroll>

              {/* Info */}
              <FadeInOnScroll direction="right" delay={0.2}>
                <div>
                  <span className="text-zone-400 text-sm font-medium tracking-wider uppercase">
                    {master.specialization}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-display font-medium text-white mt-2 mb-4">
                    {master.name}
                  </h1>
                  <p className="text-xl text-neutral-300 mb-2">{master.role}</p>
                  <p className="text-zone-400 mb-6">{master.experience}</p>

                  {/* Quote */}
                  <blockquote className="border-l-4 border-zone-500 pl-6 py-2 mb-8">
                    <p className="text-lg text-neutral-200 italic">"{master.quote}"</p>
                  </blockquote>

                  {/* Bio */}
                  <div className="prose prose-invert prose-neutral max-w-none">
                    {master.bio.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="text-neutral-300 mb-4">{paragraph}</p>
                    ))}
                  </div>
                </div>
              </FadeInOnScroll>
            </div>
          </div>
        </section>

        <SectionDivider variant="diamond" />

        {/* Achievements */}
        <section className="py-16 md:py-20 etno-shyrdak">
          <div className="container mx-auto px-4">
            <FadeInOnScroll>
              <h2 className="text-2xl md:text-3xl font-display font-medium text-white text-center mb-12">
                Достижения
              </h2>
            </FadeInOnScroll>

            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-zone-700" />

                {master.achievements.map((achievement, index) => (
                  <FadeInOnScroll
                    key={index}
                    delay={index * 0.1}
                    direction={index % 2 === 0 ? 'left' : 'right'}
                  >
                    <div className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      {/* Dot */}
                      <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-zone-500 transform -translate-x-1/2 z-10" />

                      {/* Content */}
                      <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                        <div className="glass-card p-6">
                          <span className="text-zone-400 text-sm font-medium">{achievement.year}</span>
                          <p className="text-white mt-1">{achievement.title}</p>
                        </div>
                      </div>
                    </div>
                  </FadeInOnScroll>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SectionDivider variant="wave" />

        {/* Works Gallery */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <FadeInOnScroll>
              <h2 className="text-2xl md:text-3xl font-display font-medium text-white text-center mb-4">
                Работы мастера
              </h2>
              <p className="text-neutral-400 text-center mb-12">
                {master.works.length} работ в портфолио
              </p>
            </FadeInOnScroll>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {master.works.map((work, index) => (
                <FadeInOnScroll key={work.id} delay={index * 0.05}>
                  <button
                    onClick={() => setSelectedWork(work.id)}
                    className="group relative aspect-square rounded-2xl overflow-hidden gpu-lift"
                  >
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-medium">{work.title}</h3>
                        <p className="text-neutral-300 text-sm">{work.technique}</p>
                      </div>
                    </div>
                  </button>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Work Modal */}
        <AnimatePresence>
          {selectedWork && selectedWorkData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm"
              onClick={() => setSelectedWork(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-4xl w-full glass-card overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedWork(null)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="grid md:grid-cols-2">
                  <div className="relative aspect-square">
                    <Image
                      src={selectedWorkData.image}
                      alt={selectedWorkData.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-display font-medium text-white mb-2">
                      {selectedWorkData.title}
                    </h3>
                    <div className="flex gap-4 text-sm text-neutral-400 mb-6">
                      <span>{selectedWorkData.technique}</span>
                      <span>•</span>
                      <span>{selectedWorkData.year}</span>
                    </div>
                    <p className="text-neutral-300">
                      {selectedWorkData.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <section className="py-16 md:py-20 etno-tunduk">
          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-display font-medium text-white mb-6">
                Хотите учиться у {master.name.split(' ')[0]}?
              </h2>
              <p className="text-neutral-300 mb-8">
                Запишитесь на мастер-класс и создайте своё изделие под руководством мастера
              </p>
              <a
                href={`https://wa.me/996555123456?text=Здравствуйте! Хочу записаться на мастер-класс к ${master.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-zone-500 hover:bg-zone-600 text-white rounded-2xl font-medium transition-all hover-lift"
              >
                Записаться на мастер-класс
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
              </a>
            </FadeInOnScroll>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
