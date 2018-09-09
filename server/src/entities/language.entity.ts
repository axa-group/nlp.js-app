import { Entity, Column } from 'typeorm';

@Entity()
export class Language {
  @Column()
  id: string;
  @Column()
  text: string;
}
