/*
 * Copyright (c) AXA Group Operations Spain S.A.
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

const Joi = require('joi');
const { DomainModel } = require('../../models');

/**
 * Validators for the endpoints.
 */
module.exports = {
  add: {
    payload: (() => ({
      agent: DomainModel.agent.required(),
      domainName: DomainModel.domainName.required(),
      enabled: DomainModel.enabled.required(),
      intentThreshold: DomainModel.intentThreshold.required(),
      lastTraining: DomainModel.lastTraining,
      model: DomainModel.model,
      extraTrainingData: DomainModel.extraTrainingData,
    }))(),
  },
  findById: {
    params: (() => ({
      id: DomainModel.id.required().description('Id of the domain'),
    }))(),
  },
  deleteById: {
    params: (() => ({
      id: DomainModel.id.required().description('Id of the domain'),
    }))(),
  },
  updateById: {
    params: (() => ({
      id: DomainModel.id.required().description('Id of the domain'),
    }))(),
    payload: (() => ({
      domainName: DomainModel.domainName,
      enabled: DomainModel.enabled,
      intentThreshold: DomainModel.intentThreshold,
      lastTraining: DomainModel.lastTraining,
      status: DomainModel.status,
      model: DomainModel.model,
      extraTrainingData: DomainModel.extraTrainingData,
    }))(),
  },
  findIntentsByDomainId: {
    params: (() => ({
      id: DomainModel.id.required().description('Id of the domain'),
    }))(),
    query: (() => ({
      start: Joi.number().description(
        'The index of the first element to return. 0 is the default start.'
      ),
      limit: Joi.number().description(
        'Number of elements to return from start. All the elements are returned by default'
      ),
      filter: Joi.string().description(
        'String that will filter values to return only those intents with part of this filter in their names'
      ),
    }))(),
  },
};
