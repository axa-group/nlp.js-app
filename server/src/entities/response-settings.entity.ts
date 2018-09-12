import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class ResponseSettings {
  @ObjectIdColumn()
  isEnabled: boolean;
  // you may want to have additional data in your response beside the text. Here you can enable this settings to add
  // more data to your /converse endpoint.
  @Column()
  field: string;
}
