/*
 * Copyright (c) AXA Group Operations Spain S.A.
 *
 * Licensed under the AXA Group Operations Spain S.A. License (the "License");
 * you may not use this file except in compliance with the License.
 * A copy of the License can be found in the LICENSE.TXT file distributed
 * together with this file.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const hapiAuth = require('hapi-auth-jwt2');

const Logger = require('../common/logger');
const app = require('../app');
const settings = require('./settings');
const AuthService = require('./auth.service');

const logger = Logger.getInstance();

const validate = async (decoded, request, h) => {
  logger.trace(`validate > decoded: ${JSON.stringify(decoded)}`);

  // TODO: test token expiration TokenExpiredError
  const user = decoded;

  if (!user) {
    return { credentials: null, isValid: false };
  }
  else {
    return { isValid: true, credentials: decoded };
  }
};

const authSetup = async (server, { expiryTimeInSeconds }) => {
  await server.register(hapiAuth);

  console.log('auth > expiryTimeInSeconds',expiryTimeInSeconds);

  server.auth.strategy('main', 'jwt', {
    key: settings.jwtSecret,
    validate,
    verifyOptions: {
      algorithms: [ 'HS256' ],
      expiresIn: expiryTimeInSeconds
    }
  });
};

module.exports = {
  AuthService,
  authSetup,
  authSettings: settings
};
