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

const Joi = require('joi');
const { EntityModel, ExampleModel } = require('../../models');

module.exports = {
  add: {
    payload: (() => ({
      entityName: EntityModel.entityName.required(),
      agent: EntityModel.agent.required(),
      uiColor: EntityModel.uiColor,
      regex: EntityModel.regex.allow('').allow(null),
      type: EntityModel.type
        .allow('')
        .allow(null)
        .valid('learned', 'regex')
        .optional()
        .default('learned')
        .error(
          new Error('Please provide valid entity type among learned and regex')
        ),
      examples: Joi.array()
        .items({
          value: ExampleModel.value.required(),
          synonyms: ExampleModel.synonyms.required(),
        })
        .min(1)
        .required(),
    }))(),
  },
  findById: {
    params: (() => ({
      id: EntityModel.id.required().description('Id of the entity'),
    }))(),
  },
  findIntentsByEntityId: {
    params: (() => ({
      id: EntityModel.id.required().description('Id of the entity'),
    }))(),
  },
  updateById: {
    params: (() => ({
      id: EntityModel.id.required().description('Id of the entity'),
    }))(),
    payload: (() => ({
      entityName: EntityModel.entityName,
      uiColor: EntityModel.uiColor,
      regex: EntityModel.regex.allow('').allow(null),
      type: EntityModel.type
        .allow('')
        .allow(null)
        .valid('learned', 'regex')
        .optional()
        .default('learned')
        .error(
          new Error('Please provide valid entity type among learned and regex')
        ),
      examples: Joi.array().items({
        value: ExampleModel.value.required(),
        synonyms: ExampleModel.synonyms.required(),
      }),
    }))(),
  },
  deleteById: {
    params: (() => ({
      id: EntityModel.id.required().description('Id of the entity'),
    }))(),
  },
};
