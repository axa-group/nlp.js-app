import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

import { role } from '../../constants';

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectID;
  @Column()
  name: string;
  @Column()
  username: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column({
    default: role.guest
  })
  role: string;
}
