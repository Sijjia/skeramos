import { defineType, defineField } from 'sanity';

export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Элемент галереи',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Название',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Изображение',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Описание',
      type: 'localeText',
    }),
    defineField({
      name: 'category',
      title: 'Категория (старое поле)',
      type: 'string',
      hidden: true, // Скрыто, используем categoryRef
      options: {
        list: [
          { title: 'Работы мастерской', value: 'works' },
          { title: 'Мастер-классы', value: 'masterclasses' },
          { title: 'Мероприятия', value: 'events' },
          { title: 'Интерьер', value: 'interior' },
          { title: 'Отель', value: 'hotel' },
        ],
      },
    }),
    defineField({
      name: 'categoryRef',
      title: 'Категория',
      type: 'reference',
      to: [{ type: 'galleryCategory' }],
      description: 'Выберите категорию из справочника',
    }),
    defineField({
      name: 'tags',
      title: 'Теги',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Дополнительные теги для фильтрации',
    }),
    defineField({
      name: 'date',
      title: 'Дата',
      type: 'date',
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
      category: 'category',
      media: 'image',
    },
    prepare({ title, category, media }) {
      const categories: Record<string, string> = {
        works: 'Работы',
        masterclasses: 'МК',
        events: 'События',
        interior: 'Интерьер',
        hotel: 'Отель',
      };
      return {
        title: title || 'Без названия',
        subtitle: categories[category] || '',
        media,
      };
    },
  },
});
