import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class Slot {
  @ObjectIdColumn()
  id: ObjectID;
  @Column()
  name: string;
  @Column()
  entityCode: string;
  @Column()
  isList: boolean;
  @Column()
  isRequired: boolean;
  @Column()
  textPrompt: string;
}
