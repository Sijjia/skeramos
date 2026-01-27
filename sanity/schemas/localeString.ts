import { defineType, defineField } from 'sanity';

export const localeString = defineType({
  name: 'localeString',
  title: 'Localized String',
  type: 'object',
  fields: [
    defineField({
      name: 'ru',
      title: 'Русский',
      type: 'string',
    }),
    defineField({
      name: 'kg',
      title: 'Кыргызча',
      type: 'string',
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'string',
    }),
  ],
});

export const localeText = defineType({
  name: 'localeText',
  title: 'Localized Text',
  type: 'object',
  fields: [
    defineField({
      name: 'ru',
      title: 'Русский',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'kg',
      title: 'Кыргызча',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'text',
      rows: 3,
    }),
  ],
});

export const localeBlockContent = defineType({
  name: 'localeBlockContent',
  title: 'Localized Block Content',
  type: 'object',
  fields: [
    defineField({
      name: 'ru',
      title: 'Русский',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'kg',
      title: 'Кыргызча',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
});
