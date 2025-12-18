import { BaseEntity } from './BaseEntity';

export class News extends BaseEntity {
  readonly title: string;
  readonly description: string;
  readonly deletedAt?: Date;

  constructor(
    id: string,
    title: string,
    description: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
    this.title = title;
    this.description = description;
    this.deletedAt = deletedAt;
  }
}
