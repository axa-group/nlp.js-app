import * as fs from 'fs';
import { NlpManager } from 'node-nlp';
import { Injectable } from '@nestjs/common';

import { NoTrainedAgentException } from '../../exceptions/no-trained-agent.exception';
import { Agent } from '../../entities/agent.entity';
import { Say } from '../../entities/say.entity';
import { LoggerService } from '../shared/services/logger.service';
import { Document } from './document.interface';

@Injectable()
export class NlpService {
  private readonly logger: LoggerService = new LoggerService(NlpService.name);

  initManager(options) {
    this.logger.log('Initializing manager with: %j', options);

    return new NlpManager(options);
  }

  async train(manager, agent: Agent, modelNlp, forceUpdate = false) {
    if (!forceUpdate && fs.existsSync(modelNlp)) {
      this.logger.log('Reading existing nlp model');
      manager.load(modelNlp);
      return manager;
    }
    const { intents, entities } = agent;
    const documents: Document[] = [];
    const answers: Document[] = [];

    intents.forEach(intent => {
      intent.says.forEach((say: Say) => documents.push(this.adaptDoc(intent, say.text)));
      intent.responses.forEach((response: string) => answers.push(this.adaptDoc(intent, response)));
    });

    for (const entity of entities) {
      for (const entityExample of entity.examples) {
        manager.addNamedEntityText(entity.domainCode, entity.code, entityExample.validLangs, entityExample.synonyms);
      }
    }

    for (const doc of documents) {
      manager.addDocument(doc.lang, doc.text, doc.intent);
    }

    const hrstart = process.hrtime();

    await manager.train();

    const hrend = process.hrtime(hrstart);

    this.logger.log('Trained (hr): %ds %dms', hrend[0], hrend[1] / 1000000);

    for (const answer of answers) {
      manager.addAnswer(answer.lang, answer.intent, answer.text);
    }

    manager.save(modelNlp);

    return manager;
  }

  async processLine(line, manager, { threshold = 0.7 } = {}) {
    if (!manager) {
      throw new NoTrainedAgentException();
    }
    const result = await manager.process(line);

    this.logger.log('result -> %j', result);

    return {
      answer: this.getAnswerOutput(result, threshold),
      sentiment: this.getSentimentOutput(result.sentiment)
    };
  }

  private getAnswerOutput({ score, answer }, threshold) {
    this.logger.log(`processing line with score ${score} and threshold ${threshold}`);

    return score > threshold && answer ? answer : 'Sorry, I don\'t understand';
  }

  private getSentimentOutput({ score }) {
    let output = '';

    if (score !== 0) {
      output = `  ${score > 0 ? ':)' : ':('} (${score})`;
    }

    return output;
  }

  private adaptDoc({ lang, code }, text) {
    return {
      lang,
      text,
      intent: code
    };
  }
}
