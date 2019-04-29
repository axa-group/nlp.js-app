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
const { useNeuralSettings } = require('./nlpjs-settings');
const childProcess = require('child_process');

/**
 * Class for a NLP.JS trainer
 */
class NlpjsTrainer {
  /**
   * Constructor of the class.
   */
  constructor() {
    this.managers = {};
  }

  /**
   * Adds the entities to the NLP manager.
   * @param {object} manager NLP Manager instance.
   * @param {object} data Training data.
   */
  addEntities(manager, data) {
    data.entities.forEach(entity => {
      const { entityName } = entity;
      if (entity.type === 'enum') {
        for (let i = 0; i < entity.examples.length; i += 1) {
          const example = entity.examples[i];
          const optionName = example.value;
          const language = example.language || manager.languages;
          for (let j = 0; j < example.synonyms.length; j += 1) {
            manager.addNamedEntityText(entityName, optionName, language, example.synonyms[j]);
          }
        }
      } else if (entity.type === 'regex') {
        const language = entity.language || manager.languages;
        manager.addRegexEntity(entityName, language, entity.regex);
      }
    });
  }

  /**
   * Gets a domain from the data given the id.
   * @param {string} id Domain identifier.
   * @param {object} data Training data.
   */
  getDomain(id, data) {
    for (let i = 0; i < data.domains.length; i += 1) {
      // eslint-disable-next-line no-underscore-dangle
      if (data.domains[i]._id.toString() === id) {
        return data.domains[i];
      }
    }
    return undefined;
  }

  /**
   * Gets the domain name or default.
   * @param {string} id Domain identifier.
   * @param {object} data Training data.
   */
  getDomainName(id, data) {
    for (let i = 0; i < data.domains.length; i += 1) {
      // eslint-disable-next-line no-underscore-dangle
      if (data.domains[i]._id.toString() === id) {
        return data.domains[i].domainName;
      }
    }
    return 'default';
  }

  /**
   * Gets the intent name by intent id.
   * @param {string} id Intent identifier.
   * @param {object} data Training dat.
   */
  getIntentName(id, data) {
    for (let i = 0; i < data.intents.length; i += 1) {
      // eslint-disable-next-line no-underscore-dangle
      if (data.intents[i]._id.toString() === id) {
        return data.intents[i].intentName;
      }
    }
    return 'default';
  }

  /**
   * Adds the intents to the NLP Manager.
   * @param {object} manager NLP Manager instance.
   * @param {object} data Training data.
   */
  addIntents(manager, data) {
    data.intents.forEach(intent => {
      const domain = this.getDomain(intent.domain, data);
      const { intentName } = intent;
      manager.assignDomain(domain.language || manager.languages[0], intentName, domain.domainName);
      for (let i = 0; i < intent.examples.length; i += 1) {
        const example = intent.examples[i];
        const language = domain.language || manager.languages[0];
        const utterance = example.userSays;
        manager.addDocument(language, utterance, intentName);
      }
    });
  }

  /**
   * Add the answers to the NLP Manager.
   * @param {object} manager NLP Manger instance.
   * @param {object} data Training data.
   */
  addAnswers(manager, data) {
    data.scenarios.forEach(scenario => {
      const domain = this.getDomain(scenario.domain, data);
      const language = domain.language || manager.languages[0];
      const intentName = this.getIntentName(scenario.intent, data);
      for (let i = 0; i < scenario.intentResponses.length; i += 1) {
        const answer = scenario.intentResponses[i];
        manager.addAnswer(language, intentName, answer);
      }
    });
  }

  /**
   * Add slot filling information to the NLP Manager.
   * @param {object} manager NLP Manager.
   * @param {object} data Training data.
   */
  addSlots(manager, data) {
    data.scenarios.forEach(scenario => {
      const domain = this.getDomain(scenario.domain, data);
      const language = domain.language || manager.languages[0];
      const intentName = this.getIntentName(scenario.intent, data);
      if (scenario.slots && scenario.slots.length > 0) {
        scenario.slots.forEach(slot => {
          if (slot.isRequired) {
            const managerSlot = manager.slotManager.getSlot(intentName, slot.entity);
            if (managerSlot) {
              const texts = managerSlot.locales;
              const text = slot.textPrompts[0];
              texts[language] = text;
            } else {
              const texts = {};
              const text = slot.textPrompts[0];
              texts[language] = text;
              manager.slotManager.addSlot(intentName, slot.entity, true, texts);
            }
          }
        });
      }
    });
  }

  /**
   * Train the NLP Manager using a child process.
   * @param {object} manager NLP Manager instance.
   */
  trainProcess(manager) {
    return new Promise(resolve => {
      const child = childProcess.fork('./server/trainers/nlpjs-process');
      child.on('message', managerResult => {
        child.kill();
        return resolve(managerResult);
      });
      child.send(manager);
    });
  }

  /**
   * Trains the NLP Manager with the provided training data.
   * @param {object} data Training data.
   */
  async train(data) {
    const languages = [];
    data.domains.forEach(domain => {
      if (!domain.language) {
        domain.language = 'en';
      }
      if (languages.indexOf(domain.language) === -1) {
        languages.push(domain.language);
      }
    });
    const manager = new NlpManager({
      ...useNeuralSettings,
      languages
    });
    // eslint-disable-next-line no-underscore-dangle
    this.managers[data.agent._id] = manager;
    this.addEntities(manager, data);
    this.addIntents(manager, data);
    this.addAnswers(manager, data);
    this.addSlots(manager, data);
    const result = await this.trainProcess(manager.export());
    manager.import(result);
    return result;
  }

  /**
   * Indicates if a given agent has an existing training.
   * @param {string} agentId Agent identifier.
   */
  existsTraining(agentId) {
    return this.managers[agentId] !== undefined;
  }

  /**
   * Loads training for an agent.
   * @param {string} agentId Agent identifier.
   * @param {object} model Training model.
   */
  loadTraining(agentId, model) {
    this.managers[agentId] = new NlpManager(useNeuralSettings);
    if (!model.nerManager.settings) {
      model.nerManager.settings = {};
    }
    if (!model.nerManager.namedEntities) {
      model.nerManager.namedEntities = {};
    }
    this.managers[agentId].import(model);
  }

  /**
   * Converse with a given agent.
   * @param {string} agentId Agent identifier.
   * @param {object} session Session instance.
   * @param {string} text Utterance text.
   */
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
