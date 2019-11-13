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

const Hapi = require('@hapi/hapi');
const Lalalambda = require('lalalambda');
const inert = require('inert');
const path = require('path');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');

const Logger = require('./common/logger');
const app = require('./app');
const registerFeats = require('./boot/register-feats');
const startDatabase = require('./boot/start-database');

const logger = Logger.getInstance();
const port = process.env.PORT || 3000;

const server = new Hapi.Server({
	port,
	routes: {
		cors: true,
		files: {
			relativeTo: path.join(__dirname, '../public')
		}
	}
});
app.server = server;

const swaggerOptions = {
	info: {
		title: 'Test API Documentation',
		version: '1.0.0'
	}
};

if (process.env.HEROKU_APP_NAME) {
	const name = process.env.HEROKU_APP_NAME;
	if (name.includes('.')) {
		swaggerOptions.host = process.env.HEROKU_APP_NAME;
	} else {
		swaggerOptions.host = `${process.env.HEROKU_APP_NAME}.herokuapp.com`;
	}
}

/**
 * Starts the server.
 */
async function startServer() {
  registerFeats();
  await server.register({
    plugin: Lalalambda,
    options: {
        lambdaify: true
    }
  });
  await server.register([
    inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);
  server.ext('onPreHandler', (request, h) => {
    const host = request.info.hostname;
    if (host.includes('herokuapp.com')) {
      swaggerOptions.host = host;
    }
    return h.continue;
  });
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: (request, h) => {
      const { param } = request.params;
      if (param.includes('.')) {
        return h.file(param);
      }
      return h.file('index.html');
    },
  });
  if (!process.env.SERVERLESS) {
    await server.start();
    logger.info(`Server running at: ${server.info.uri}`);
  }
}

async function start() {
	await startDatabase();
	await startServer();
}

if (process.env.SERVERLESS) {
  module.exports = {
    deployment: async () => {
      await start();
      return server;
    }
  };
} else {
  module.exports = {
	start
  };
}
