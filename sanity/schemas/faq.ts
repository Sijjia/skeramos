import { defineType, defineField } from 'sanity';

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Вопрос',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Ответ',
      type: 'localeText',
      validation: (Rule) => Rule.required(),
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Категория',
      type: 'string',
      options: {
        list: [
          { title: 'Бронирование', value: 'booking' },
          { title: 'Оплата', value: 'payment' },
          { title: 'Услуги', value: 'services' },
          { title: 'Локация', value: 'location' },
          { title: 'Другое', value: 'other' },
        ],
      },
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
      question: 'question.ru',
      zone: 'zone',
    },
    prepare({ question, zone }) {
      const zones: Record<string, string> = {
        creativity: 'Творчество',
        hotel: 'Отель',
        general: 'Общее',
      };
      return {
        title: question || 'Без вопроса',
        subtitle: zones[zone] || '',
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
