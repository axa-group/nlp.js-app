import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class Domain {
  @ObjectIdColumn()
  id: ObjectID;
  @Column()
  isEnabled: boolean;
  @Column()
  code: string;
  @Column()
  name: string;
  @Column()
  intentRecognitionThreshold: number;
  @Column()
  // create combinations between entities and intents
  withExtraTrainingExamples: boolean;
}
