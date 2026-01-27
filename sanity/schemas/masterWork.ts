import { defineType, defineField } from 'sanity';

export const masterWork = defineType({
  name: 'masterWork',
  title: 'Работа мастера',
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
    }),
    defineField({
      name: 'master',
      title: 'Мастер',
      type: 'reference',
      to: [{ type: 'master' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Фотография работы',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Дополнительные фото',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Описание',
      type: 'localeText',
      description: 'История создания, техника, материалы',
    }),
    defineField({
      name: 'technique',
      title: 'Техника',
      type: 'string',
      options: {
        list: [
          { title: 'Гончарный круг', value: 'wheel' },
          { title: 'Ручная лепка', value: 'handbuilt' },
          { title: 'Литьё', value: 'casting' },
          { title: 'Роспись', value: 'painting' },
          { title: 'Смешанная', value: 'mixed' },
        ],
      },
    }),
    defineField({
      name: 'year',
      title: 'Год создания',
      type: 'string',
    }),
    defineField({
      name: 'dimensions',
      title: 'Размеры',
      type: 'string',
      description: 'Например: "20x15x10 см"',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Показывать в галерее',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Порядок сортировки',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title.ru',
      master: 'master.name.ru',
      media: 'image',
    },
    prepare({ title, master, media }) {
      return {
        title: title || 'Без названия',
        subtitle: master ? `Автор: ${master}` : '',
        media,
      };
    },
  },
});
