import { defineType, defineField } from 'sanity';

export const companyHistory = defineType({
  name: 'companyHistory',
  title: 'История компании',
  type: 'document',
  fields: [
    defineField({
      name: 'year',
      title: 'Год',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Заголовок',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Описание',
      type: 'localeText',
      validation: (Rule) => Rule.required(),
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
      name: 'milestone',
      title: 'Тип события',
      type: 'string',
      options: {
        list: [
          { title: 'Основание', value: 'founding' },
          { title: 'Достижение', value: 'achievement' },
          { title: 'Расширение', value: 'expansion' },
          { title: 'Награда', value: 'award' },
          { title: 'Событие', value: 'event' },
        ],
      },
    }),
    defineField({
      name: 'order',
      title: 'Порядок (для сортировки)',
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
      year: 'year',
      media: 'image',
    },
    prepare({ title, year, media }) {
      return {
        title: `${year}: ${title || 'Без названия'}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'По году',
      name: 'yearAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
});
