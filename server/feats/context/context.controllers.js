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

const app = require('../../app');

const modelName = 'session';

async function addById(request) {
  const agentId = request.params.id;
  const agent = app.database.findById('agent', agentId);
  if (!agent) {
    return app.error(404, 'The agent was not found');
  }
  const { sessionId } = request.query;
  let sessionAny = await app.database.findOne(modelName, {
    'any.agentId': agentId,
    'any.sessionId': sessionId,
  });
  if (!sessionAny) {
    sessionAny = {
      any: {
        agentId,
        sessionId,
        context: {},
      },
    };
  }
  return app.database.save(modelName, sessionAny.any);
}

async function findById(request) {
  const agentId = request.params.id;
  const agent = app.database.findById('agent', agentId);
  if (!agent) {
    return app.error(404, 'The agent was not found');
  }
  const { sessionId } = request.query;
  const sessionAny = await app.database.findOne('session', {
    'any.agentId': agentId,
    'any.sessionId': sessionId,
  });
  if (!sessionAny) {
    return {
      agentId,
      sessionId,
      context: {},
    };
  }
  return sessionAny.any;
}

async function deleteById(request) {
  const agentId = request.params.id;
  const agent = app.database.findById('agent', agentId);
  if (!agent) {
    return app.error(404, 'The agent was not found');
  }
  const { sessionId } = request.query;
  return app.database.remove(modelName, {
    'any.agentId': agentId,
    'any.sessionId': sessionId,
  });
}

module.exports = {
  addById,
  findById,
  deleteById,
};
