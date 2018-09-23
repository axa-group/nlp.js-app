import { Entity, Column } from 'typeorm';

@Entity()
export class Fallback {
  @Column()
  text: string;
  @Column()
  lang: string;
}
