import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class EntityExample {
  @ObjectIdColumn()
  id: ObjectID;
  @Column()
  value: string;
  @Column()
  synonyms: string[];
}
