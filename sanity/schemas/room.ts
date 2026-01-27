import { defineType, defineField } from 'sanity';

export const room = defineType({
  name: 'room',
  title: 'Номер',
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
      name: 'images',
      title: 'Изображения',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'pricePerNight',
      title: 'Цена за ночь (сом)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'roomType',
      title: 'Тип номера',
      type: 'string',
      options: {
        list: [
          { title: 'Стандарт', value: 'standard' },
          { title: 'Комфорт', value: 'comfort' },
          { title: 'Люкс', value: 'luxury' },
          { title: 'Хостел', value: 'hostel' },
        ],
      },
    }),
    defineField({
      name: 'capacity',
      title: 'Вместимость (человек)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'amenities',
      title: 'Удобства',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Иконка',
              type: 'string',
              description: 'Название иконки (wifi, tv, ac, etc.)',
            }),
            defineField({
              name: 'label',
              title: 'Название',
              type: 'localeString',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'area',
      title: 'Площадь (м²)',
      type: 'number',
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
      price: 'pricePerNight',
      media: 'images.0',
    },
    prepare({ title, price, media }) {
      return {
        title: title || 'Без названия',
        subtitle: price ? `${price} сом/ночь` : '',
        media,
      };
    },
  },
});
