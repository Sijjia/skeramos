import { defineType, defineField } from 'sanity';

export const service = defineType({
  name: 'service',
  title: 'Услуга',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Название',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL-идентификатор',
      type: 'slug',
      options: {
        source: 'title.ru',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Краткое описание',
      type: 'localeText',
      description: 'Краткое описание для карточки (1-2 предложения)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fullDescription',
      title: 'Полное описание',
      type: 'localeBlockContent',
      description: 'Подробное описание услуги',
    }),
    defineField({
      name: 'image',
      title: 'Изображение',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Галерея',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'price',
      title: 'Цена (сом)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'priceNote',
      title: 'Примечание к цене',
      type: 'string',
      description: 'Например: "от", "за человека", "за час"',
    }),
    defineField({
      name: 'duration',
      title: 'Длительность',
      type: 'string',
      description: 'Например: "2 часа", "8 занятий × 3 часа"',
    }),
    defineField({
      name: 'groupSize',
      title: 'Размер группы',
      type: 'string',
      description: 'Например: "1-4 человека", "до 20 человек"',
    }),
    defineField({
      name: 'includes',
      title: 'Что входит',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Список того, что входит в стоимость',
    }),
    defineField({
      name: 'category',
      title: 'Категория',
      type: 'string',
      options: {
        list: [
          { title: 'Мастер-класс', value: 'masterclass' },
          { title: 'Курс', value: 'course' },
          { title: 'Мероприятие', value: 'event' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'externalLink',
      title: 'Внешняя ссылка',
      type: 'url',
      description: 'Ссылка на внешний сервис бронирования (Altegio и т.д.)',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https'],
      }),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Показывать на главной',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Порядок сортировки',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'isActive',
      title: 'Активна',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title.ru',
      price: 'price',
      category: 'category',
      media: 'image',
    },
    prepare({ title, price, category, media }) {
      const categories: Record<string, string> = {
        masterclass: 'МК',
        course: 'Курс',
        event: 'Ивент',
      };
      return {
        title: title || 'Без названия',
        subtitle: `${price?.toLocaleString()} сом | ${categories[category] || ''}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'По порядку',
      name: 'orderAsc',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
    {
      title: 'По цене',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
  ],
});
