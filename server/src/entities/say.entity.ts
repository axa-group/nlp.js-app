import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

import { EntitySay } from './entity-say.entity';

@Entity()
export class Say {
  @ObjectIdColumn()
  id: ObjectID;
  @Column()
  text: string;
  @Column()
  entities: EntitySay[];
}
