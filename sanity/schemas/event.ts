import { defineType, defineField } from 'sanity';

export const event = defineType({
  name: 'event',
  title: 'Ивент',
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
      name: 'eventType',
      title: 'Тип ивента',
      type: 'string',
      options: {
        list: [
          { title: 'Тимбилдинг', value: 'teambuilding' },
          { title: 'День рождения', value: 'birthday' },
          { title: 'Девичник', value: 'bachelorette' },
          { title: 'Корпоратив', value: 'corporate' },
          { title: 'Другое', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'priceFrom',
      title: 'Цена от (сом)',
      type: 'number',
    }),
    defineField({
      name: 'groupSizeMin',
      title: 'Мин. размер группы',
      type: 'number',
    }),
    defineField({
      name: 'groupSizeMax',
      title: 'Макс. размер группы',
      type: 'number',
    }),
    defineField({
      name: 'includes',
      title: 'Что включено',
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
      eventType: 'eventType',
      media: 'image',
    },
    prepare({ title, eventType, media }) {
      const types: Record<string, string> = {
        teambuilding: 'Тимбилдинг',
        birthday: 'День рождения',
        bachelorette: 'Девичник',
        corporate: 'Корпоратив',
        other: 'Другое',
      };
      return {
        title: title || 'Без названия',
        subtitle: types[eventType] || '',
        media,
      };
    },
  },
});
