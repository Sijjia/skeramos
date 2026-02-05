'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useZone } from '@/contexts/ZoneContext';
import { useMasters } from '@/hooks/useSanityData';
import { Award, Star, MessageCircle } from 'lucide-react';

import { Footer } from '@/components/layout/Footer';
import { FadeInOnScroll } from '@/components/animations/OptimizedAnimations';
import { EtnoPatternOverlay, GlowingAccent, SectionDivider } from '@/components/animations/EtnoDecorations';

function getWhatsAppLink(phone: string, masterName: string): string {
  const message = encodeURIComponent(`Здравствуйте! Хочу записаться на мастер-класс к ${masterName}`);
  return `https://wa.me/${phone}?text=${message}`;
}

export default function MastersPage() {
  const { setZone } = useZone();
  const locale = useLocale();
  const { data: masters, loading } = useMasters();

  useEffect(() => {
    setZone('creativity');
  }, [setZone]);

  // Фильтруем только активных мастеров
  const activeMasters = masters.filter(m => m.active !== false);

  return (
    <>

      <EtnoPatternOverlay pattern="tunduk" opacity={0.02} />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <GlowingAccent position="top-right" zone="creativity" size={600} />

          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-2 rounded-full glass text-sm text-zone-300 font-medium mb-6">
                Команда Skeramos
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-medium text-neutral-800 mb-6">
                Наши{' '}
                <span className="bg-gradient-to-r from-zone-400 to-gold-500 bg-clip-text text-transparent">
                  мастера
                </span>
              </h1>
              <p className="text-lg text-neutral-500">
                Профессионалы, которые делятся своим мастерством и любовью к керамике.
                Каждый из них — мастер своего дела с уникальным стилем и подходом.
              </p>
            </FadeInOnScroll>
          </div>
        </section>

        <SectionDivider variant="wave" className="opacity-50" />

        {/* Masters Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-white/10"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-6 bg-white/10 rounded w-3/4"></div>
                      <div className="h-4 bg-white/10 rounded w-1/2"></div>
                      <div className="h-16 bg-white/10 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activeMasters.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeMasters.map((master, index) => (
                  <FadeInOnScroll
                    key={master.id}
                    delay={index * 0.1}
                    className="group"
                  >
                    <Link href={`/${locale}/masters/${master.id}`}>
                      <article className="glass-card overflow-hidden cursor-pointer">
                        {/* Photo */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          {master.image ? (
                            <Image
                              src={master.image}
                              alt={master.name}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-zone-500/20 flex items-center justify-center">
                              <span className="text-6xl text-zone-500/50">👨‍🎨</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                        </div>

                        {/* Info */}
                        <div className="p-6">
                          <h2 className="text-xl font-display font-medium text-white mb-1 group-hover:text-zone-300 transition-colors">
                            {master.name}
                          </h2>
                        <p className="text-neutral-400 text-sm mb-2">
                          {master.role}
                        </p>
                        {master.experience && (
                          <p className="text-zone-400 text-sm mb-4">
                            {master.experience}
                          </p>
                        )}

                        {/* Bio */}
                        {master.bio && (
                          <p className="text-neutral-300 text-sm mb-4 line-clamp-2">
                            {master.bio}
                          </p>
                        )}

                        {/* Specialties */}
                        {master.specialties && master.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {master.specialties.slice(0, 3).map((spec, idx) => (
                              <span key={idx} className="text-xs px-2 py-0.5 bg-zone-500/20 text-zone-300 rounded">
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Achievements */}
                        {master.achievements && master.achievements.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Award className="w-4 h-4 text-zone-500" />
                              <span className="text-sm text-neutral-400">Достижения</span>
                            </div>
                            <ul className="space-y-1">
                              {master.achievements.slice(0, 3).map((achievement, idx) => {
                                const text = typeof achievement === 'string' ? achievement : achievement.text;
                                const year = typeof achievement === 'string' ? null : achievement.year;
                                return (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-neutral-300">
                                    <Star className="w-3 h-3 text-zone-500 mt-1 flex-shrink-0" />
                                    <span>{year ? `${year}: ` : ''}{text}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}

                        {/* View more link */}
                        <div className="pt-4 border-t border-neutral-200">
                          <span className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-zone-500/10 hover:bg-zone-500/20 text-zone-600 rounded-lg text-sm font-medium transition-colors">
                            Подробнее о мастере →
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                  </FadeInOnScroll>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <span className="text-6xl mb-4 block">👨‍🎨</span>
                <h3 className="text-xl text-neutral-800 mb-2">Информация о мастерах скоро появится</h3>
                <p className="text-neutral-500">Мы готовим для вас интересные истории наших мастеров</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 etno-tunduk">
          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-medium text-neutral-800 mb-6">
                Хотите учиться у наших мастеров?
              </h2>
              <p className="text-neutral-600 mb-8">
                Запишитесь на мастер-класс и создайте своё первое изделие под руководством профессионалов
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href={`/${locale}/services`}
                  className="px-8 py-4 bg-zone-500 hover:bg-zone-600 text-white rounded-2xl font-medium transition-all hover-lift"
                >
                  Выбрать мастер-класс
                </Link>
                <a
                  href="https://wa.me/996555123456?text=Здравствуйте! Хочу записаться на мастер-класс"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 glass hover:bg-neutral-100 text-neutral-700 rounded-2xl font-medium transition-all"
                >
                  Написать в WhatsApp
                </a>
              </div>
            </FadeInOnScroll>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
