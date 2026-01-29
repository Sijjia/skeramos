import { defineType, defineField } from 'sanity';

export const galleryCategory = defineType({
  name: 'galleryCategory',
  title: 'Категория галереи',
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
      name: 'description',
      title: 'Описание',
      type: 'localeText',
    }),
    defineField({
      name: 'icon',
      title: 'Иконка',
      type: 'string',
      description: 'Название Lucide иконки (например: Camera, Palette, Hotel)',
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
      initialValue: 'general',
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
      zone: 'zone',
    },
    prepare({ title, zone }) {
      const zones: Record<string, string> = {
        creativity: 'Творчество',
        hotel: 'Отель',
        general: 'Общее',
      };
      return {
        title: title || 'Без названия',
        subtitle: zones[zone] || '',
      };
    },
  },
});
