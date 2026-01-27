import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Настройки сайта',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Название сайта',
      type: 'string',
      initialValue: 'Skeramos',
    }),
    defineField({
      name: 'tagline',
      title: 'Слоган',
      type: 'localeString',
    }),
    defineField({
      name: 'description',
      title: 'Описание сайта (SEO)',
      type: 'localeText',
    }),
    defineField({
      name: 'logo',
      title: 'Логотип',
      type: 'image',
    }),
    defineField({
      name: 'phone',
      title: 'Телефон',
      type: 'string',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp номер',
      type: 'string',
      description: 'Формат: 996XXXXXXXXX',
    }),
    defineField({
      name: 'telegram',
      title: 'Telegram username',
      type: 'string',
      description: 'Без @',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram username',
      type: 'string',
      description: 'Без @',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Адрес',
      type: 'localeString',
    }),
    defineField({
      name: 'mapCoordinates',
      title: 'Координаты для карты',
      type: 'object',
      fields: [
        defineField({
          name: 'lat',
          title: 'Широта',
          type: 'number',
        }),
        defineField({
          name: 'lng',
          title: 'Долгота',
          type: 'number',
        }),
      ],
    }),
    defineField({
      name: 'workingHours',
      title: 'Часы работы',
      type: 'localeText',
    }),
    defineField({
      name: 'defaultLanguage',
      title: 'Язык по умолчанию',
      type: 'string',
      options: {
        list: [
          { title: 'Русский', value: 'ru' },
          { title: 'Кыргызча', value: 'kg' },
          { title: 'English', value: 'en' },
        ],
      },
      initialValue: 'ru',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Настройки сайта',
      };
    },
  },
});
