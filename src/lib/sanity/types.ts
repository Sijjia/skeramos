// Sanity Image type
export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// Localized types
export interface LocaleString {
  ru?: string;
  kg?: string;
  en?: string;
}

export interface LocaleText {
  ru?: string;
  kg?: string;
  en?: string;
}

export interface LocaleBlockContent {
  ru?: unknown[];
  kg?: unknown[];
  en?: unknown[];
}

// Sanity document base
export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt?: string;
  _updatedAt?: string;
}

// Slug type
export interface Slug {
  current: string;
}

// Masterclass
export interface Masterclass extends SanityDocument {
  _type: 'masterclass';
  title: LocaleString;
  slug: Slug;
  description?: LocaleText;
  image?: SanityImage;
  price: number;
  duration: number;
  groupSize?: string;
  includes?: LocaleText;
  order?: number;
  isActive?: boolean;
}

// Course
export interface Course extends SanityDocument {
  _type: 'course';
  title: LocaleString;
  slug: Slug;
  description?: LocaleText;
  image?: SanityImage;
  price: number;
  sessions: number;
  totalDuration?: number;
  program?: LocaleBlockContent;
  targetAudience?: LocaleText;
  order?: number;
  isActive?: boolean;
}

// Event
export interface SkeramosEvent extends SanityDocument {
  _type: 'event';
  title: LocaleString;
  slug: Slug;
  description?: LocaleText;
  image?: SanityImage;
  eventType?: 'teambuilding' | 'birthday' | 'bachelorette' | 'corporate' | 'other';
  priceFrom?: number;
  groupSizeMin?: number;
  groupSizeMax?: number;
  includes?: LocaleText;
  order?: number;
  isActive?: boolean;
}

// Room
export interface Amenity {
  icon?: string;
  label?: LocaleString;
}

export interface Room extends SanityDocument {
  _type: 'room';
  title: LocaleString;
  slug: Slug;
  description?: LocaleText;
  images?: SanityImage[];
  pricePerNight: number;
  roomType?: 'standard' | 'comfort' | 'luxury' | 'hostel';
  capacity: number;
  amenities?: Amenity[];
  area?: number;
  order?: number;
  isActive?: boolean;
}

// Package
export interface PackageItem {
  item?: LocaleString;
}

export interface ServicePackage extends SanityDocument {
  _type: 'package';
  title: LocaleString;
  slug: Slug;
  description?: LocaleText;
  image?: SanityImage;
  price: number;
  packageType?: 'romantic' | 'friends' | 'family' | 'vip';
  includes?: PackageItem[];
  duration?: LocaleString;
  forPersons?: string;
  isFeatured?: boolean;
  order?: number;
  isActive?: boolean;
}

// FAQ
export type Zone = 'creativity' | 'hotel' | 'general';
export type FaqCategory = 'booking' | 'payment' | 'services' | 'location' | 'other';

export interface FAQ extends SanityDocument {
  _type: 'faq';
  question: LocaleString;
  answer: LocaleText;
  zone: Zone;
  category?: FaqCategory;
  order?: number;
  isActive?: boolean;
}

// Site Settings
export interface MapCoordinates {
  lat?: number;
  lng?: number;
}

export interface SiteSettings extends SanityDocument {
  _type: 'siteSettings';
  siteName?: string;
  tagline?: LocaleString;
  description?: LocaleText;
  logo?: SanityImage;
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  instagram?: string;
  email?: string;
  address?: LocaleString;
  mapCoordinates?: MapCoordinates;
  workingHours?: LocaleText;
  defaultLanguage?: 'ru' | 'kg' | 'en';
}

// Promo Banner
export interface PromoBanner extends SanityDocument {
  _type: 'promoBanner';
  title: LocaleString;
  description?: LocaleText;
  image?: SanityImage;
  ctaText?: LocaleString;
  ctaLink?: string;
  zone?: 'all' | 'creativity' | 'hotel';
  position?: 'top' | 'middle' | 'bottom';
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

// Helper type for getting localized content
export type Locale = 'ru' | 'kg' | 'en';

export function getLocalizedValue<T extends string | undefined>(
  localized: LocaleString | LocaleText | undefined,
  locale: Locale
): T | undefined {
  if (!localized) return undefined;
  return (localized[locale] || localized.ru || localized.en) as T | undefined;
}
