export interface CreateNewsDTO {
  title: string;
  description: string;
}

export const createNewsSchema = {
  type: 'object',
  required: ['title', 'description'],
  properties: {
    title: {
      type: 'string',
      minLength: 3,
      maxLength: 255,
    },
    description: {
      type: 'string',
      minLength: 10,
    },
  },
};
