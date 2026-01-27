import { groq } from 'next-sanity';

// Masterclasses
export const masterclassesQuery = groq`
  *[_type == "masterclass" && isActive == true] | order(order asc) {
    _id,
    title,
    slug,
    description,
    image,
    price,
    duration,
    groupSize,
    includes
  }
`;

export const masterclassQuery = groq`
  *[_type == "masterclass" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    image,
    price,
    duration,
    groupSize,
    includes
  }
`;

// Courses
export const coursesQuery = groq`
  *[_type == "course" && isActive == true] | order(order asc) {
    _id,
    title,
    slug,
    description,
    image,
    price,
    sessions,
    totalDuration,
    program,
    targetAudience
  }
`;

// Events
export const eventsQuery = groq`
  *[_type == "event" && isActive == true] | order(order asc) {
    _id,
    title,
    slug,
    description,
    image,
    eventType,
    priceFrom,
    groupSizeMin,
    groupSizeMax,
    includes
  }
`;

// Rooms
export const roomsQuery = groq`
  *[_type == "room" && isActive == true] | order(order asc) {
    _id,
    title,
    slug,
    description,
    images,
    pricePerNight,
    roomType,
    capacity,
    amenities,
    area
  }
`;

export const roomQuery = groq`
  *[_type == "room" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    images,
    pricePerNight,
    roomType,
    capacity,
    amenities,
    area
  }
`;

// Packages
export const packagesQuery = groq`
  *[_type == "package" && isActive == true] | order(order asc) {
    _id,
    title,
    slug,
    description,
    image,
    price,
    packageType,
    includes,
    duration,
    forPersons,
    isFeatured
  }
`;

export const featuredPackagesQuery = groq`
  *[_type == "package" && isActive == true && isFeatured == true] | order(order asc) {
    _id,
    title,
    slug,
    description,
    image,
    price,
    packageType,
    includes,
    duration,
    forPersons
  }
`;

// FAQ
export const faqByZoneQuery = groq`
  *[_type == "faq" && isActive == true && zone == $zone] | order(order asc) {
    _id,
    question,
    answer,
    category
  }
`;

export const allFaqQuery = groq`
  *[_type == "faq" && isActive == true] | order(zone asc, order asc) {
    _id,
    question,
    answer,
    zone,
    category
  }
`;

// Site Settings
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    tagline,
    description,
    logo,
    phone,
    whatsapp,
    telegram,
    instagram,
    email,
    address,
    mapCoordinates,
    workingHours,
    defaultLanguage
  }
`;

// Promo Banners
export const activePromoBannersQuery = groq`
  *[_type == "promoBanner" && isActive == true && (
    !defined(startDate) || startDate <= now()
  ) && (
    !defined(endDate) || endDate >= now()
  )] | order(order asc) {
    _id,
    title,
    description,
    image,
    ctaText,
    ctaLink,
    zone,
    position
  }
`;

export const promoBannersByZoneQuery = groq`
  *[_type == "promoBanner" && isActive == true && (zone == $zone || zone == "all") && (
    !defined(startDate) || startDate <= now()
  ) && (
    !defined(endDate) || endDate >= now()
  )] | order(order asc) {
    _id,
    title,
    description,
    image,
    ctaText,
    ctaLink,
    position
  }
`;
