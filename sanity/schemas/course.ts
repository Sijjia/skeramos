import { defineType, defineField } from 'sanity';

export const course = defineType({
  name: 'course',
  title: 'Профкурс',
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
      title: 'URL (slug)',
      type: 'slug',
      options: {
        source: 'title.ru',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Описание',
      type: 'localeText',
    }),
    defineField({
      name: 'image',
      title: 'Изображение',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'price',
      title: 'Цена (сом)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'sessions',
      title: 'Количество занятий',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'totalDuration',
      title: 'Общая длительность (часы)',
      type: 'number',
    }),
    defineField({
      name: 'program',
      title: 'Программа курса',
      type: 'localeBlockContent',
    }),
    defineField({
      name: 'targetAudience',
      title: 'Для кого',
      type: 'localeText',
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
      title: 'title.ru',
      sessions: 'sessions',
      media: 'image',
    },
    prepare({ title, sessions, media }) {
      return {
        title: title || 'Без названия',
        subtitle: sessions ? `${sessions} занятий` : '',
        media,
      };
    },
  },
});
