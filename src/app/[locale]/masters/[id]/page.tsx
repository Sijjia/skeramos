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
              <h1 className="text-2xl text-white mb-4">Мастер не найден</h1>
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
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
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
                  <h1 className="text-4xl md:text-5xl font-display font-medium text-white mt-2 mb-4">
                    {master.name}
                  </h1>

                  {master.experience && (
                    <div className="flex items-center gap-2 text-neutral-300 mb-6">
                      <Clock className="w-5 h-5 text-zone-500" />
                      <span>{master.experience}</span>
                    </div>
                  )}

                  {/* Bio */}
                  {master.bio && (
                    <div className="prose prose-invert prose-neutral max-w-none mb-8">
                      <p className="text-neutral-300 text-lg leading-relaxed whitespace-pre-line">
                        {master.bio}
                      </p>
                    </div>
                  )}

                  {/* Specialties */}
                  {master.specialties && master.specialties.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-3">
                        <Palette className="w-5 h-5 text-zone-500" />
                        <h3 className="text-lg font-medium text-white">Специализация</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {master.specialties.map((spec, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 bg-zone-500/20 text-zone-300 rounded-lg"
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

        {/* Achievements Section */}
        {master.achievements && master.achievements.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <FadeInOnScroll>
                <div className="flex items-center gap-3 mb-8">
                  <Award className="w-8 h-8 text-zone-500" />
                  <h2 className="text-3xl font-display font-medium text-white">
                    Достижения
                  </h2>
                </div>
              </FadeInOnScroll>

              <div className="grid md:grid-cols-2 gap-4">
                {master.achievements.map((achievement, idx) => (
                  <FadeInOnScroll key={idx} delay={idx * 0.1}>
                    <div className="glass-card p-6 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-zone-500/20 flex items-center justify-center flex-shrink-0">
                        <Star className="w-5 h-5 text-zone-500" />
                      </div>
                      <p className="text-neutral-300">{achievement}</p>
                    </div>
                  </FadeInOnScroll>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 md:py-24 etno-tunduk">
          <div className="container mx-auto px-4">
            <FadeInOnScroll className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-6">
                Хотите учиться у {master.name}?
              </h2>
              <p className="text-neutral-300 mb-8">
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
                  className="px-8 py-4 glass hover:bg-white/10 text-white rounded-2xl font-medium transition-all"
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
