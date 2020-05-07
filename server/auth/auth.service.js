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

const jwt = require('jsonwebtoken');

const { UserAlreadyExistsException, InvalidCredentialsException, InvalidAuthorizationException } = require('./exceptions');
const Logger = require('../common/logger');
const { jwtSecret } = require('./settings');

const logger = Logger.getInstance();

class AuthService {
  constructor(db) {
    this.db = db;
    this.User = this.db.models.users;
    // this.loginService = new LoginService();
  }

  async register({ email, password, scope }) {
	const user = await this.User.findOne({ email });

	if (user) {
	  throw new UserAlreadyExistsException();
    }
    return await this.User.create({
      email,
      // TODO: encrypt password!
      password,
      scope,
      updatedAt: new Date() // TODO: improve this?
    });
  }

  async login({ email, password }) {
    const user = await this.User.findOne({ email });

    if (user) {
      // TODO: store encrypted pwd
      if (user.password !== password) {
        throw new InvalidCredentialsException();
      }
      const tokenPayload = {
        email: user.email,
        scope: user.scope
      };
      console.log('future tokenPayload > ',tokenPayload);
      const token = jwt.sign(tokenPayload, jwtSecret);
      const response = {
        scope: user.scope,
        token
      };
      return response;
    }
    throw new InvalidAuthorizationException();
  }
}

module.exports = AuthService;
