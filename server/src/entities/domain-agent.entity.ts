import { Entity, Column } from 'typeorm';

import { Domain } from './domain.entity';

@Entity()
export class DomainAgent {
  @Column()
  domain: Domain;
  @Column()
  isEnabled: boolean;
  @Column()
  intentThreshold: number;
}
