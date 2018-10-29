/*
 * Copyright (c) AXA Shared Services Spain S.A.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const { NlpManager } = require('node-nlp');
const childProcess = require('child_process');

class NlpjsTrainer {
  constructor() {
    this.managers = {};
  }

  addEntities(manager, data) {
    data.entities.forEach(entity => {
      const { entityName } = entity;
      if (entity.type === 'enum') {
        for (let i = 0; i < entity.examples.length; i += 1) {
          const example = entity.examples[i];
          const optionName = example.value;
          const language = example.language || manager.languages[0];
          for (let j = 0; j < example.synonyms.length; j += 1) {
            manager.addNamedEntityText(
              entityName,
              optionName,
              language,
              example.synonyms[j]
            );
          }
        }
      } else if (entity.type === 'regex') {
        const language = entity.language || manager.languages[0];
        manager.addRegexEntity(entityName, language, entity.regex);
      }
    });
  }

  getDomainName(id, data) {
    for (let i = 0; i < data.domains.length; i += 1) {
      // eslint-disable-next-line no-underscore-dangle
      if (data.domains[i]._id.toString() === id) {
        return data.domains[i].domainName;
      }
    }
    return 'default';
  }

  getIntentName(id, data) {
    for (let i = 0; i < data.intents.length; i += 1) {
      // eslint-disable-next-line no-underscore-dangle
      if (data.intents[i]._id.toString() === id) {
        return data.intents[i].intentName;
      }
    }
    return 'default';
  }

  addIntents(manager, data) {
    data.intents.forEach(intent => {
      const domainName = this.getDomainName(intent.domain, data);
      const { intentName } = intent;
      for (let i = 0; i < intent.examples.length; i += 1) {
        const example = intent.examples[i];
        const language = example.language || manager.languages[0];
        const utterance = example.userSays;
        manager.addDocument(language, utterance, intentName);
      }
      manager.assignDomain(intentName, domainName);
    });
  }

  addAnswers(manager, data) {
    data.scenarios.forEach(scenario => {
      const language = scenario.language || manager.languages[0];
      const intentName = this.getIntentName(scenario.intent, data);
      for (let i = 0; i < scenario.intentResponses.length; i += 1) {
        const answer = scenario.intentResponses[i];
        manager.addAnswer(language, intentName, answer);
      }
    });
  }

  trainProcess(manager) {
    return new Promise(resolve => {
      const child = childProcess.fork('./server/trainers/nlpjs-process');
      child.on('message', managerResult => resolve(managerResult));
      child.send(manager);
    });
  }

  async train(data) {
    const languages = data.agent.language.split(',').map(x => x.trim());
    const manager = new NlpManager({ languages });
    // eslint-disable-next-line no-underscore-dangle
    this.managers[data.agent._id] = manager;
    this.addEntities(manager, data);
    this.addIntents(manager, data);
    this.addAnswers(manager, data);
    return this.trainProcess(manager.export());
  }

  existsTraining(agentId) {
    return this.managers[agentId] !== undefined;
  }

  loadTraining(agentId, model) {
    this.managers[agentId] = new NlpManager();
    if (!model.nerManager.settings) {
      model.nerManager.settings = {};
    }
    if (!model.nerManager.namedEntities) {
      model.nerManager.namedEntities = {};
    }
    this.managers[agentId].import(model);
  }

  converse(agentId, session, text) {
    const manager = this.managers[agentId];
    if (!manager) {
      throw new Error('Unknown manager');
    }
    return manager.process(undefined, text, session.context);
  }
}

const instance = new NlpjsTrainer();

module.exports = instance;
