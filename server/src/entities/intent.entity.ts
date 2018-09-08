import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

import { Say } from './say.entity';
import { Slot } from './slot.entity';
import { WebhookSettings } from './webhook-settings.entity';

@Entity()
export class Intent {
  @ObjectIdColumn()
  id: ObjectID;
  @Column()
  domainId: ObjectID;
  @Column()
  // standardized version of name
  code: string;
  @Column()
  name: string;
  @Column()
  says: Say[];
  @Column()
  responses: string[];
  @Column()
  slots: Slot[];
  @Column()
  webhookSettings: WebhookSettings;
}
