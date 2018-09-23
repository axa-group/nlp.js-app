import { NewAgentDto } from './new-agent.dto';

export class PartialAgentDto extends NewAgentDto {
  status: string;
  owner: string;
}
