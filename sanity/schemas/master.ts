import { defineType, defineField } from 'sanity';

export const master = defineType({
  name: 'master',
  title: 'Мастер',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Имя',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL (slug)',
      type: 'slug',
      options: {
        source: 'name.ru',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Должность',
      type: 'localeString',
      description: 'Например: "Мастер гончарного круга"',
    }),
    defineField({
      name: 'photo',
      title: 'Фотография',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'experience',
      title: 'Опыт работы',
      type: 'localeString',
      description: 'Например: "15 лет опыта"',
    }),
    defineField({
      name: 'specialization',
      title: 'Специализация',
      type: 'localeString',
      description: 'Например: "Традиционная кыргызская керамика"',
    }),
    defineField({
      name: 'bio',
      title: 'Биография',
      type: 'localeText',
      description: 'Полная история мастера',
    }),
    defineField({
      name: 'quote',
      title: 'Цитата',
      type: 'localeString',
      description: 'Любимая цитата или девиз мастера',
    }),
    defineField({
      name: 'achievements',
      title: 'Достижения',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Достижение',
              type: 'localeString',
            }),
            defineField({
              name: 'year',
              title: 'Год',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Социальные сети',
      type: 'object',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
        defineField({ name: 'telegram', title: 'Telegram', type: 'url' }),
      ],
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
      title: 'name.ru',
      role: 'role.ru',
      media: 'photo',
    },
    prepare({ title, role, media }) {
      return {
        title: title || 'Без имени',
        subtitle: role || '',
        media,
      };
    },
  },
  orderings: [
    {
      title: 'По порядку',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
});
