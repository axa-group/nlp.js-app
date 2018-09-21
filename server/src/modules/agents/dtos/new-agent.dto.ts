export class NewAgentDto {
  name: string;
  description: string;
  languages: string[];
  domainThreshold: number;
  fallbackResponses: string[];
  webhookSettings: boolean;
}
