import { Entity, Column } from 'typeorm';

@Entity()
export class WebhookSettings {
  @Column()
  isEnabled: boolean;
  @Column()
  verb: string;
  @Column()
  url: string;
}
