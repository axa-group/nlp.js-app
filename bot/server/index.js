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

require('dotenv').config();
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { getToken, converse } = require('./controller.js');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));

app.get('/api/getToken/:agentId', (req, res) => {
  const { agentId } = req.params;
  getToken(agentId, res);
});

app.get('/api/getToken', (req, res) => {
  getToken(undefined, res);
});

app.get('/api/converse', (req, res) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(404).send('Agent not found');
  }
  const { text } = req.query;
  if (!text) {
    return res.status(404).send('The message is empty');
  }
  const token = authorization.slice(7);
  return converse(token, text, res);
});


const isServerless = process.env.SERVERLESS === undefined ? true : !(process.env.SERVERLESS.toLowerCase() === 'false');
if (isServerless) {
  module.exports.handler = serverless(app);
} else {
  const port = process.env.PORT || process.env.port || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
  module.exports = app;
}


