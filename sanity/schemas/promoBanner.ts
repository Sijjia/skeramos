import { defineType, defineField } from 'sanity';

export const promoBanner = defineType({
  name: 'promoBanner',
  title: 'Промо-баннер',
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
      name: 'ctaText',
      title: 'Текст кнопки',
      type: 'localeString',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Ссылка кнопки',
      type: 'string',
    }),
    defineField({
      name: 'zone',
      title: 'Показывать в зоне',
      type: 'string',
      options: {
        list: [
          { title: 'Все', value: 'all' },
          { title: 'Творчество', value: 'creativity' },
          { title: 'Отель', value: 'hotel' },
        ],
      },
      initialValue: 'all',
    }),
    defineField({
      name: 'position',
      title: 'Позиция',
      type: 'string',
      options: {
        list: [
          { title: 'Верх страницы', value: 'top' },
          { title: 'Между секциями', value: 'middle' },
          { title: 'Низ страницы', value: 'bottom' },
        ],
      },
    }),
    defineField({
      name: 'startDate',
      title: 'Дата начала показа',
      type: 'datetime',
    }),
    defineField({
      name: 'endDate',
      title: 'Дата окончания показа',
      type: 'datetime',
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
      zone: 'zone',
      media: 'image',
    },
    prepare({ title, zone, media }) {
      const zones: Record<string, string> = {
        all: 'Все зоны',
        creativity: 'Творчество',
        hotel: 'Отель',
      };
      return {
        title: title || 'Без названия',
        subtitle: zones[zone] || '',
        media,
      };
    },
  },
});
