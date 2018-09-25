import { Entity, Column } from 'typeorm';

@Entity()
export class EntityExample {
  @Column()
  value: string;
  @Column()
  synonyms: string[];
  @Column()
  validLangs: string[];
}
