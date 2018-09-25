import { Entity as EntityTypeOrm, Column, ObjectIdColumn, ObjectID, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { utc } from '../constants';
import { defaultStatus } from '../modules/agents/settings';
import { Fallback } from './fallback.entity';
import { Intent } from './intent.entity';
import { DomainAgent } from './domain-agent.entity';
import { Language } from './language.entity';
import { WebhookSettings } from './webhook-settings.entity';
import { Entity } from './entity.entity';

@EntityTypeOrm()
export class Agent {
  @ObjectIdColumn()
  id: ObjectID;
  @Column()
  name: string;
  @Column({ default: defaultStatus })
  // ready | training | ...
  status: string;
  @Column()
  description: string;
  @Column()
  languages: Language[];
  @Column()
  fallbackResponses: Fallback[];
  @Column()
  intents: Intent[];
  @Column()
  domainThreshold: number;
  @Column()
  domains: DomainAgent[];
  @Column()
  entities: Entity[];
  @Column()
  // to define a global webhook that will be called each time the user talks with your agent then you can do it here
  webhookSettings: WebhookSettings;
  @Column()
  owner: ObjectID;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @Column()
  trainedAt: Date;
  @Column({ default: utc })
  defaultTimeZone: string;
}
