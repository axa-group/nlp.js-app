import { Entity, Column } from 'typeorm';

@Entity()
export class Language {
  // en_US, en, 'English', true
  @Column()
  id: string;
  @Column()
  code: string;
  @Column()
  text: string;
  @Column()
  isDefault?: boolean;
}
