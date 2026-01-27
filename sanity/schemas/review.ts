import { defineType, defineField } from 'sanity';

export const review = defineType({
  name: 'review',
  title: 'Отзыв',
  type: 'document',
  fields: [
    defineField({
      name: 'authorName',
      title: 'Имя автора',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorPhoto',
      title: 'Фото автора',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'text',
      title: 'Текст отзыва',
      type: 'localeText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Оценка',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5),
      options: {
        list: [
          { title: '⭐', value: 1 },
          { title: '⭐⭐', value: 2 },
          { title: '⭐⭐⭐', value: 3 },
          { title: '⭐⭐⭐⭐', value: 4 },
          { title: '⭐⭐⭐⭐⭐', value: 5 },
        ],
      },
      initialValue: 5,
    }),
    defineField({
      name: 'zone',
      title: 'Зона',
      type: 'string',
      options: {
        list: [
          { title: 'Творчество', value: 'creativity' },
          { title: 'Отель', value: 'hotel' },
          { title: 'Общее', value: 'general' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'service',
      title: 'Услуга',
      type: 'string',
      description: 'Какой услугой пользовался автор',
    }),
    defineField({
      name: 'date',
      title: 'Дата отзыва',
      type: 'date',
    }),
    defineField({
      name: 'source',
      title: 'Источник',
      type: 'string',
      options: {
        list: [
          { title: 'Google', value: 'google' },
          { title: '2GIS', value: '2gis' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'Сайт', value: 'website' },
        ],
      },
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
      title: 'Активен',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'authorName',
      rating: 'rating',
      zone: 'zone',
      media: 'authorPhoto',
    },
    prepare({ title, rating, zone, media }) {
      const stars = '⭐'.repeat(rating || 0);
      const zones: Record<string, string> = {
        creativity: 'Творчество',
        hotel: 'Отель',
        general: 'Общее',
      };
      return {
        title: title || 'Без имени',
        subtitle: `${stars} | ${zones[zone] || ''}`,
        media,
      };
    },
  },
});
