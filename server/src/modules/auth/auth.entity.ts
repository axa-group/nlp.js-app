import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class Auth {
  @ObjectIdColumn()
  id: ObjectID;
  @Column()
  username: string;
  @Column()
  refreshToken: string;
  @Column()
  expiresAt: Date;
}
