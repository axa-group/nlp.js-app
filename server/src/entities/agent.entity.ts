import { Entity, Column, ObjectIdColumn, ObjectID, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { utc } from '../constants';
import { Intent } from './intent.entity';
import { DomainAgent } from './domain-agent.entity';
import { Language } from './language.entity';
import { WebhookSettings } from './webhook-settings.entity';

@Entity()
export class Agent {
  @ObjectIdColumn()
  id: ObjectID;
  @Column()
  name: string;
  @Column()
  // ready | training | ...
  status: string;
  @Column()
  description: string;
  @Column()
  languages: Language[];
  @Column()
  fallbackResponses: string[];
  @Column()
  intents: Intent[];
  @Column()
  domainThreshold: number;
  @Column()
  domains: DomainAgent;
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
