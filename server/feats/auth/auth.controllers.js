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

const Logger = require('../../common/logger');
const { AuthService, authSettings } = require('../../auth');
const app = require('../../app');

const { defaultScope } = authSettings;

const logger = Logger.getInstance();

let authInstance;

const getAuthInstance = () => {
	return authInstance || new AuthService(app.database);
};

async function register(request, h) {
	// INFO: right now, after login, the administrator needs to switch scope from foreign to grant access
	try {
		const { email, password } = request.payload;
		const user = await getAuthInstance().register({ email: email.toLowerCase(), password, scope: defaultScope });

		console.log('register > user',user);

		return { email };
	} catch(error) {
		logger.error(`Error: auth controller register: ${error}`);
		return error;
	}
}

async function login(request, h) {
	const { password } = request.payload;
	const email = request.payload.email.toLowerCase();

	try {
		const { token, scope } = await getAuthInstance().login({ email, password });

		return { email, createdAt: new Date(), scope, token };
	} catch(error) {
		logger.error(`Error: auth controller login: ${error}`);
		return error;
	}
}

module.exports = {
	login,
	register
};
