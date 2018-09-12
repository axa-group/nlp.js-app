import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

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
  @Column({
    default: 'guest'
  })
  role: string;
}
