import { defineType, defineField } from 'sanity';

export const advantage = defineType({
  name: 'advantage',
  title: 'Преимущество',
  type: 'document',
  fields: [
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
      name: 'icon',
      title: 'Иконка Lucide',
      type: 'string',
      description: 'Название иконки из Lucide (например: Palette, GraduationCap, Home, Gift, Clock, Users)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'zone',
      title: 'Зона',
      type: 'string',
      options: {
        list: [
          { title: 'Творчество (МК)', value: 'creativity' },
          { title: 'Отель', value: 'hotel' },
          { title: 'Общее', value: 'general' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Порядок сортировки',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'isActive',
      title: 'Активно',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title.ru',
      icon: 'icon',
      zone: 'zone',
    },
    prepare({ title, icon, zone }) {
      const zones: Record<string, string> = {
        creativity: 'МК',
        hotel: 'Отель',
        general: 'Общее',
      };
      return {
        title: title || 'Без названия',
        subtitle: `${icon} | ${zones[zone] || ''}`,
      };
    },
  },
  orderings: [
    {
      title: 'По порядку',
      name: 'orderAsc',
      by: [
        { field: 'zone', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
});
