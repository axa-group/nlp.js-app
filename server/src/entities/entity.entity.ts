import { Entity as EnitityTypeOrm, Column, ObjectIdColumn, ObjectID } from 'typeorm';

import { EntityExample } from './entity-example.entity';

@EnitityTypeOrm()
export class Entity {
  @ObjectIdColumn()
  id: ObjectID;
  @Column()
  // ej: size, toppings, order-process
  code: string;
  @Column()
  // 'learned' | 'regex'
  type: string;
  @Column()
  color: string;
  @Column()
  examples: EntityExample[];
}
