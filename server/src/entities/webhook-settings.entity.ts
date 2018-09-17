import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class WebhookSettings {
  @ObjectIdColumn()
  isEnabled: boolean;
  @Column()
  verb: string;
  @Column()
  url: string;
}
