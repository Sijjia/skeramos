import { client, getClient } from './client';
import {
  masterclassesQuery,
  masterclassQuery,
  coursesQuery,
  eventsQuery,
  roomsQuery,
  roomQuery,
  packagesQuery,
  featuredPackagesQuery,
  faqByZoneQuery,
  allFaqQuery,
  siteSettingsQuery,
  activePromoBannersQuery,
  promoBannersByZoneQuery,
} from './queries';
import type {
  Masterclass,
  Course,
  SkeramosEvent,
  Room,
  ServicePackage,
  FAQ,
  SiteSettings,
  PromoBanner,
  Locale,
  LocaleString,
  LocaleText,
  SanityImage,
} from './types';
import { urlFor } from './image';

// Helper to get localized value
export function getLocalized(
  localized: LocaleString | LocaleText | undefined,
  locale: Locale
): string {
  if (!localized) return '';
  return localized[locale] || localized.ru || localized.en || '';
}

// Helper to get image URL from Sanity image
export function getImageUrl(
  image: SanityImage | undefined,
  options?: { width?: number; height?: number; quality?: number }
): string {
  if (!image?.asset) return '';

  let builder = urlFor(image);

  if (options?.width) builder = builder.width(options.width);
  if (options?.height) builder = builder.height(options.height);
  if (options?.quality) builder = builder.quality(options.quality);

  return builder.auto('format').url();
}

// ============================================================================
// Masterclasses
// ============================================================================

export async function getMasterclasses(preview = false): Promise<Masterclass[]> {
  return getClient(preview).fetch(masterclassesQuery);
}

export async function getMasterclass(
  slug: string,
  preview = false
): Promise<Masterclass | null> {
  return getClient(preview).fetch(masterclassQuery, { slug });
}

// Formatted for UI with locale
export async function getMasterclassesForUI(
  locale: Locale,
  preview = false
) {
  const masterclasses = await getMasterclasses(preview);

  return masterclasses.map((mc) => ({
    id: mc._id,
    title: getLocalized(mc.title, locale),
    description: getLocalized(mc.description, locale),
    image: getImageUrl(mc.image, { width: 800, height: 600, quality: 80 }),
    duration: `${mc.duration} ${mc.duration === 1 ? 'час' : mc.duration < 5 ? 'часа' : 'часов'}`,
    capacity: mc.groupSize || '1-8 чел',
    price: mc.price,
    slug: mc.slug?.current,
  }));
}

// ============================================================================
// Courses
// ============================================================================

export async function getCourses(preview = false): Promise<Course[]> {
  return getClient(preview).fetch(coursesQuery);
}

export async function getCoursesForUI(locale: Locale, preview = false) {
  const courses = await getCourses(preview);

  return courses.map((course) => ({
    id: course._id,
    title: getLocalized(course.title, locale),
    description: getLocalized(course.description, locale),
    image: getImageUrl(course.image, { width: 800, height: 600, quality: 80 }),
    duration: `${course.sessions} занятий`,
    capacity: '4-6 чел',
    price: course.price,
    slug: course.slug?.current,
  }));
}

// ============================================================================
// Events
// ============================================================================

export async function getEvents(preview = false): Promise<SkeramosEvent[]> {
  return getClient(preview).fetch(eventsQuery);
}

export async function getEventsForUI(locale: Locale, preview = false) {
  const events = await getEvents(preview);

  return events.map((event) => ({
    id: event._id,
    title: getLocalized(event.title, locale),
    description: getLocalized(event.description, locale),
    image: getImageUrl(event.image, { width: 800, height: 600, quality: 80 }),
    duration: '2-3 часа',
    capacity: event.groupSizeMax ? `до ${event.groupSizeMax} чел` : 'до 20 чел',
    price: event.priceFrom || 3000,
    priceLabel: 'от',
    slug: event.slug?.current,
    eventType: event.eventType,
  }));
}

// ============================================================================
// Rooms
// ============================================================================

export async function getRooms(preview = false): Promise<Room[]> {
  return getClient(preview).fetch(roomsQuery);
}

export async function getRoom(
  slug: string,
  preview = false
): Promise<Room | null> {
  return getClient(preview).fetch(roomQuery, { slug });
}

export async function getRoomsForUI(locale: Locale, preview = false) {
  const rooms = await getRooms(preview);

  return rooms.map((room) => ({
    id: room._id,
    title: getLocalized(room.title, locale),
    description: getLocalized(room.description, locale),
    images: room.images?.map((img) =>
      getImageUrl(img, { width: 800, height: 600, quality: 80 })
    ) || [],
    amenities: room.amenities?.map((a) => ({
      icon: (a.icon || 'bed') as 'bed' | 'tv' | 'heating' | 'wifi' | 'shower' | 'kitchen',
      label: getLocalized(a.label, locale),
    })) || [],
    price: room.pricePerNight,
    capacity: room.capacity,
    slug: room.slug?.current,
    roomType: room.roomType,
  }));
}

// ============================================================================
// Packages
// ============================================================================

export async function getPackages(preview = false): Promise<ServicePackage[]> {
  return getClient(preview).fetch(packagesQuery);
}

export async function getFeaturedPackages(
  preview = false
): Promise<ServicePackage[]> {
  return getClient(preview).fetch(featuredPackagesQuery);
}

export async function getPackagesForUI(locale: Locale, preview = false) {
  const packages = await getPackages(preview);

  return packages.map((pkg) => ({
    id: pkg._id,
    title: getLocalized(pkg.title, locale),
    description: getLocalized(pkg.description, locale),
    image: getImageUrl(pkg.image, { width: 800, height: 450, quality: 80 }),
    includes: pkg.includes?.map((item) => getLocalized(item.item, locale)) || [],
    price: pkg.price,
    featured: pkg.isFeatured || false,
    slug: pkg.slug?.current,
    packageType: pkg.packageType,
  }));
}

// ============================================================================
// FAQ
// ============================================================================

export async function getFAQByZone(
  zone: 'creativity' | 'hotel' | 'general',
  preview = false
): Promise<FAQ[]> {
  return getClient(preview).fetch(faqByZoneQuery, { zone });
}

export async function getAllFAQ(preview = false): Promise<FAQ[]> {
  return getClient(preview).fetch(allFaqQuery);
}

export async function getFAQForUI(
  zone: 'creativity' | 'hotel' | 'general',
  locale: Locale,
  preview = false
) {
  const faqs = await getFAQByZone(zone, preview);

  return faqs.map((faq) => ({
    question: getLocalized(faq.question, locale),
    answer: getLocalized(faq.answer, locale),
  }));
}

// ============================================================================
// Site Settings
// ============================================================================

export async function getSiteSettings(
  preview = false
): Promise<SiteSettings | null> {
  return getClient(preview).fetch(siteSettingsQuery);
}

export async function getSiteSettingsForUI(locale: Locale, preview = false) {
  const settings = await getSiteSettings(preview);

  if (!settings) return null;

  return {
    siteName: settings.siteName || 'Skeramos',
    tagline: getLocalized(settings.tagline, locale),
    description: getLocalized(settings.description, locale),
    phone: settings.phone || '+996555123456',
    whatsapp: settings.whatsapp || settings.phone || '+996555123456',
    telegram: settings.telegram || 'skeramos',
    instagram: settings.instagram || 'skeramos',
    email: settings.email || 'info@skeramos.kg',
    address: getLocalized(settings.address, locale),
    workingHours: getLocalized(settings.workingHours, locale),
    mapCoordinates: settings.mapCoordinates,
  };
}

// ============================================================================
// Promo Banners
// ============================================================================

export async function getActivePromoBanners(
  preview = false
): Promise<PromoBanner[]> {
  return getClient(preview).fetch(activePromoBannersQuery);
}

export async function getPromoBannersByZone(
  zone: 'creativity' | 'hotel' | 'all',
  preview = false
): Promise<PromoBanner[]> {
  return getClient(preview).fetch(promoBannersByZoneQuery, { zone });
}

export async function getPromoBannersForUI(
  zone: 'creativity' | 'hotel' | 'all',
  locale: Locale,
  preview = false
) {
  const banners = await getPromoBannersByZone(zone, preview);

  return banners.map((banner) => ({
    id: banner._id,
    title: getLocalized(banner.title, locale),
    description: getLocalized(banner.description, locale),
    image: getImageUrl(banner.image, { width: 1200, height: 400, quality: 85 }),
    ctaText: getLocalized(banner.ctaText, locale),
    ctaLink: banner.ctaLink,
    position: banner.position || 'top',
  }));
}
