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
const {
  IntentModel,
  IntentExampleModel,
  IntentEntityModel,
  ScenarioModel,
  SlotModel,
} = require('../../models');

/**
 * Endpoint Validators.
 */
module.exports = {
  add: {
    payload: (() => ({
      agent: IntentModel.agent
        .required()
        .error(
          new Error(
            'The agent is required. Please specify an agent for the intent.'
          )
        ),
      domain: IntentModel.domain
        .required()
        .error(
          new Error(
            'The domain is required. Please specify a domain for the intent'
          )
        ),
      intentName: IntentModel.intentName
        .required()
        .error(new Error('The intent name is required')),
      useWebhook: IntentModel.useWebhook
        .required()
        .error(
          new Error(
            'Please specify if this intent use a webhook for fullfilment.'
          )
        ),
      usePostFormat: IntentModel.usePostFormat
        .required()
        .error(
          new Error(
            'Please specify if this intent use a post format for fullfilment.'
          )
        ),
      examples: Joi.array()
        .items({
          userSays: IntentExampleModel.userSays
            .required()
            .error(new Error('The user says text is required')),
          entities: Joi.array()
            .items({
              entityId: Joi.number()
                .required()
                .error(
                  new Error(
                    'You must specify the id of the entity that you are tagging in the examples'
                  )
                ),
              start: IntentEntityModel.start
                .required()
                .error(
                  new Error(
                    'The start value should be an integer and it is required.'
                  )
                ),
              end: IntentEntityModel.end
                .required()
                .error(
                  new Error(
                    'The end value should be an integer and it is required.'
                  )
                ),
              value: IntentEntityModel.value
                .required()
                .error(new Error('The parsed value is required.')),
              entity: IntentEntityModel.entity
                .required()
                .error(new Error('The entity reference is required.')),
              extractor: IntentEntityModel.extractor,
            })
            .required()
            .allow([]),
        })
        .required()
        .min(2),
    }))(),
  },
  findById: {
    params: (() => ({
      id: IntentModel.id.required().description('Id of the intent'),
    }))(),
  },
  updateById: {
    params: (() => ({
      id: IntentModel.id.required().description('Id of the intent'),
    }))(),
    payload: (() => ({
      intentName: IntentModel.intentName,
      useWebhook: IntentModel.useWebhook,
      usePostFormat: IntentModel.usePostFormat,
      examples: Joi.array()
        .items({
          userSays: IntentExampleModel.userSays
            .required()
            .error(new Error('The user says text is required')),
          entities: Joi.array()
            .items({
              entityId: Joi.number(),
              start: IntentEntityModel.start
                .required()
                .error(
                  new Error(
                    'The start value should be an integer and it is required for all entities.'
                  )
                ),
              end: IntentEntityModel.end
                .required()
                .error(
                  new Error(
                    'The end value should be an integer and it is required for all entities.'
                  )
                ),
              value: IntentEntityModel.value
                .required()
                .error(new Error('The value is required for all entities.')),
              entity: IntentEntityModel.entity
                .required()
                .error(
                  new Error(
                    'The entity reference is required for all entities in examples.'
                  )
                ),
              extractor: IntentEntityModel.extractor,
            })
            .required()
            .allow([]),
        })
        .min(2),
    }))(),
  },
  deleteById: {
    params: (() => ({
      id: IntentModel.id.required().description('Id of the intent'),
    }))(),
  },
  addScenario: {
    params: (() => ({
      id: IntentModel.id.required().description('Id of the intent'),
    }))(),
    payload: (() => ({
      agent: ScenarioModel.agent
        .required()
        .error(
          new Error(
            'The agent is required. Please specify an agent for the scenario.'
          )
        ),
      domain: ScenarioModel.domain
        .required()
        .error(
          new Error(
            'The domain is required. Please specify a domain for the scenario.'
          )
        ),
      intent: ScenarioModel.intent
        .required()
        .error(
          new Error(
            'The intent is required. Please specify an intent for the scenario.'
          )
        ),
      scenarioName: ScenarioModel.scenarioName
        .required()
        .error(
          new Error(
            'The name is required. Please specify a name for the scenario.'
          )
        ),
      slots: Joi.array().items({
        slotName: SlotModel.slotName
          .required()
          .error(new Error('The slot name is required.')),
        entity: SlotModel.entity
          .required()
          .error(new Error('The entity is required for the slot.')),
        isList: SlotModel.isList
          .required()
          .error(
            new Error('Please specify if the slot is a list of items or not.')
          ),
        isRequired: SlotModel.isRequired
          .required()
          .error(new Error('Please specify if the slot is required or not.')),
        textPrompts: SlotModel.textPrompts,
      }),
      intentResponses: ScenarioModel.intentResponses,
    }))(),
  },
  findScenario: {
    params: (() => ({
      id: IntentModel.id.required().description('Id of the intent'),
    }))(),
  },
  updateScenario: {
    params: (() => ({
      id: IntentModel.id.required().description('Id of the intent'),
    }))(),
    payload: (() => ({
      scenarioName: ScenarioModel.scenarioName,
      slots: Joi.array().items({
        slotName: SlotModel.slotName.required(),
        entity: SlotModel.entity.required(),
        isList: SlotModel.isList.required(),
        isRequired: SlotModel.isRequired.required(),
        textPrompts: SlotModel.textPrompts,
      }),
      intentResponses: ScenarioModel.intentResponses,
    }))(),
  },
  deleteScenario: {
    params: (() => ({
      id: IntentModel.id.required().description('Id of the intent'),
    }))(),
  },
};
