'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useZone } from '@/contexts/ZoneContext';
import { useMasters } from '@/hooks/useSanityData';
import { Award, Star, MessageCircle, ArrowLeft, Clock, Palette } from 'lucide-react';

import { Footer } from '@/components/layout/Footer';
import { FadeInOnScroll } from '@/components/animations/OptimizedAnimations';
import { EtnoPatternOverlay, GlowingAccent } from '@/components/animations/EtnoDecorations';

function getWhatsAppLink(phone: string, masterName: string): string {
  const message = encodeURIComponent(`Здравствуйте! Хочу записаться на мастер-класс к ${masterName}`);
  return `https://wa.me/${phone}?text=${message}`;
}

export default function MasterDetailPage() {
  const { setZone } = useZone();
  const locale = useLocale();
  const params = useParams();
  const masterId = params.id as string;
  const { data: masters, loading } = useMasters();

  useEffect(() => {
    setZone('creativity');
  }, [setZone]);

  // Find the master
  const master = masters.find(m => m.id === masterId);

  // Loading state
  if (loading) {
    return (
      <>
        <main className="min-h-screen bg-background pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="flex items-center justify-center">
              <div className="inline-block w-8 h-8 border-2 border-zone-500 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Not found
  if (!master) {
    return (
      <>
        <main className="min-h-screen bg-background pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <span className="text-6xl mb-4 block">👤</span>
              <h1 className="text-2xl text-neutral-800 mb-4">Мастер не найден</h1>
              <Link
                href={`/${locale}/masters`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-zone-500 hover:bg-zone-600 text-white rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Вернуться к мастерам
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <EtnoPatternOverlay pattern="shyrdak" opacity={0.02} />

      <main className="min-h-screen bg-background pt-20">
        {/* Back button */}
        <div className="container mx-auto px-4 py-6">
          <Link
            href={`/${locale}/masters`}
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Все мастера
          </Link>
        </div>

        {/* Hero Section */}
        <section className="relative py-8 md:py-16 overflow-hidden">
          <GlowingAccent position="top-right" zone="creativity" size={500} />

          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Photo */}
              <FadeInOnScroll direction="left">
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden">
                  {master.image ? (
                    <Image
                      src={master.image}
                      alt={master.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-zone-500/20 flex items-center justify-center">
                      <span className="text-9xl text-zone-500/50">👨‍🎨</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                </div>
              </FadeInOnScroll>

              {/* Info */}
              <FadeInOnScroll direction="right">
                <div className="lg:sticky lg:top-24">
                  <span className="text-zone-400 text-sm font-medium tracking-wider uppercase">
                    {master.role}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-display font-medium text-neutral-800 mt-2 mb-4">
                    {master.name}
                  </h1>

                  {master.experience && (
                    <div className="flex items-center gap-2 text-neutral-600 mb-6">
                      <Clock className="w-5 h-5 text-zone-500" />
                      <span>{master.experience}</span>
                    </div>
                  )}

                  {/* Bio */}
                  {master.bio && (
                    <div className="prose prose-invert prose-neutral max-w-none mb-8">
                      <p className="text-neutral-600 text-lg leading-relaxed whitespace-pre-line">
                        {master.bio}
                      </p>
                    </div>
                  )}

                  {/* Specialties */}
                  {master.specialties && master.specialties.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-3">
                        <Palette className="w-5 h-5 text-zone-500" />
                        <h3 className="text-lg font-medium text-neutral-800">Специализация</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {master.specialties.map((spec, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 bg-zone-500/10 text-zone-600 rounded-lg"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WhatsApp Button */}
                  {master.whatsapp && (
                    <a
                      href={getWhatsAppLink(master.whatsapp, master.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-2xl font-medium transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Записаться на мастер-класс
                    </a>
                  )}
                </div>
              </FadeInOnScroll>
            </div>
          </div>
        </section>

        {/* Achievements Section - Timeline */}
        {master.achievements && master.achievements.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <FadeInOnScroll>
                <div className="flex items-center gap-3 mb-12">
                  <Award className="w-8 h-8 text-zone-500" />
                  <h2 className="text-3xl font-display font-medium text-neutral-800">
                    Достижения
                  </h2>
                </div>
              </FadeInOnScroll>

              {/* Timeline */}
              <div className="relative max-w-3xl mx-auto">
                {/* Vertical line */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-zone-500/30 transform md:-translate-x-1/2" />

                {/* Achievements */}
                <div className="space-y-8">
                  {(master.achievements as Array<{ year: number; text: string } | string>).map((achievement, idx) => {
                    // Support both old (string) and new (object) format
                    const isOldFormat = typeof achievement === 'string';
                    const year = isOldFormat ? '' : achievement.year;
                    const text = isOldFormat ? achievement : achievement.text;

                    return (
                      <FadeInOnScroll key={idx} delay={idx * 0.1} direction={idx % 2 === 0 ? 'left' : 'right'}>
                        <div className={`relative flex items-start gap-4 md:gap-8 ${
                          idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                        }`}>
                          {/* Year badge */}
                          <div className={`hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-zone-500 items-center justify-center z-10`}>
                            <span className="text-white font-bold text-lg">{year || '•'}</span>
                          </div>

                          {/* Content */}
                          <div className={`flex-1 ml-16 md:ml-0 ${idx % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                            <div className="glass-card p-6">
                              {/* Mobile year */}
                              {year && (
                                <div className="md:hidden flex items-center gap-2 mb-2">
                                  <div className="w-8 h-8 rounded-full bg-zone-500 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">{year}</span>
                                  </div>
                                </div>
                              )}
                              {/* Desktop year */}
                              {year && (
                                <span className="hidden md:block text-zone-400 font-bold text-lg mb-2">{year}</span>
                              )}
                              <p className="text-neutral-600">{text}</p>
                            </div>
                          </div>

                          {/* Spacer for opposite side */}
                          <div className="hidden md:block flex-1" />

                          {/* Mobile dot */}
                          <div className="absolute left-8 top-6 w-4 h-4 rounded-full bg-zone-500 transform -translate-x-1/2 md:hidden" />
                        </div>
                      </FadeInOnScroll>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 md:py-24 etno-tunduk">
          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-medium text-neutral-800 mb-6">
                Хотите учиться у {master.name}?
              </h2>
              <p className="text-neutral-600 mb-8">
                Запишитесь на мастер-класс и создайте своё изделие под руководством мастера
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {master.whatsapp ? (
                  <a
                    href={getWhatsAppLink(master.whatsapp, master.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-zone-500 hover:bg-zone-600 text-white rounded-2xl font-medium transition-all"
                  >
                    Записаться
                  </a>
                ) : (
                  <Link
                    href={`/${locale}/services`}
                    className="px-8 py-4 bg-zone-500 hover:bg-zone-600 text-white rounded-2xl font-medium transition-all"
                  >
                    Выбрать мастер-класс
                  </Link>
                )}
                <Link
                  href={`/${locale}/masters`}
                  className="px-8 py-4 glass hover:bg-neutral-100 text-neutral-700 rounded-2xl font-medium transition-all"
                >
                  Все мастера
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
