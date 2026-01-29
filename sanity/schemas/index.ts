import { localeString, localeText, localeBlockContent } from './localeString';
import { masterclass } from './masterclass';
import { course } from './course';
import { event } from './event';
import { room } from './room';
import { servicePackage } from './package';
import { faq } from './faq';
import { siteSettings } from './siteSettings';
import { promoBanner } from './promoBanner';

// Новые схемы
import { master } from './master';
import { masterWork } from './masterWork';
import { galleryItem } from './galleryItem';
import { galleryCategory } from './galleryCategory';
import { companyHistory } from './companyHistory';
import { review } from './review';

// Расширенные схемы для админки
import { advantage } from './advantage';
import { service } from './service';

export const schemaTypes = [
  // Локализованные типы
  localeString,
  localeText,
  localeBlockContent,

  // Команда
  master,
  masterWork,

  // Документы — Творчество
  masterclass,
  course,
  event,

  // Услуги (новое)
  service,

  // Документы — Отель
  room,
  servicePackage,

  // Галерея
  galleryCategory,
  galleryItem,

  // Преимущества
  advantage,

  // Общие документы
  faq,
  review,
  companyHistory,
  siteSettings,
  promoBanner,
];
