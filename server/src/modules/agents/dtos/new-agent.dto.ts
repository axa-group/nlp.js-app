import { Fallback } from '../../../entities/fallback.entity';
import { Language } from '../../../entities/language.entity';
import { WebhookSettings } from '../../../entities/webhook-settings.entity';

export class NewAgentDto {
  name: string;
  description: string;
  languages: Language[];
  domainThreshold: number;
  fallbackResponses: Fallback[];
  webhookSettings: WebhookSettings;
}
