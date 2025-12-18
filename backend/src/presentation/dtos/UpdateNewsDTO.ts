export interface UpdateNewsDTO {
  title?: string;
  description?: string;
}

export const updateNewsSchema = {
  type: 'object',
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
  minProperties: 1, // At least one property must be provided
};
