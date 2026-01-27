import { defineType, defineField } from 'sanity';

export const servicePackage = defineType({
  name: 'package',
  title: 'Пакет услуг',
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
      name: 'packageType',
      title: 'Тип пакета',
      type: 'string',
      options: {
        list: [
          { title: 'Романтический', value: 'romantic' },
          { title: 'Для друзей', value: 'friends' },
          { title: 'Семейный', value: 'family' },
          { title: 'VIP', value: 'vip' },
        ],
      },
    }),
    defineField({
      name: 'includes',
      title: 'Что включено',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'item',
              title: 'Пункт',
              type: 'localeString',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'duration',
      title: 'Длительность',
      type: 'localeString',
      description: 'Например: "1 ночь", "выходные"',
    }),
    defineField({
      name: 'forPersons',
      title: 'Для скольки человек',
      type: 'string',
      description: 'Например: "для двоих", "до 4 человек"',
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
      title: 'title.ru',
      price: 'price',
      media: 'image',
    },
    prepare({ title, price, media }) {
      return {
        title: title || 'Без названия',
        subtitle: price ? `${price} сом` : '',
        media,
      };
    },
  },
});
