import { Entity, Column, ObjectID } from 'typeorm';

@Entity()
export class EntitySay {
  @Column()
  start: string;
  @Column()
  end: string;
  @Column()
  value: string;
  @Column()
  entityCode: string;
  @Column()
  entityId: ObjectID;
}
