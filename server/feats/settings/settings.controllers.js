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
const response = require('./response.json');

const modelName = 'settings';

async function findAll() {
  let settings = await app.database.find(modelName);
  if (!settings || settings.length === 0) {
    settings = await app.database.save(modelName, { any: response });
  } else {
    [settings] = settings;
  }
  return settings.any;
}

async function findSettingsByName(request) {
  const { name } = request.params;
  const settings = await app.database.find(modelName);
  return settings ? settings.any[name] : undefined;
}

async function update(request) {
  const updateData = JSON.parse(request.payload);
  await app.database.deleteMany(modelName);
  const settings = await app.database.save(modelName, { any: updateData });
  return settings.any;
}

module.exports = {
  findAll,
  findSettingsByName,
  update,
};
