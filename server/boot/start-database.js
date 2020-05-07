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

const Logger = require('../common/logger');
const Database = require('../core/database');
const app = require('../app');
const { AgentModel, DomainModel, IntentModel, EntityModel, ScenarioModel, UsersModel } = require('../models');
const { Model } = require('../constants');

const logger = Logger.getInstance();

/**
 * Starts the database.
 * Initialize the models and connect.
 */
async function startDatabase(settings = {}) {
	logger.info('start database');
	app.database = new Database(settings);

	app.database.addModel(Model.Settings);
	app.database.addModel(Model.Training);
	app.database.addModel(Model.Session);
	app.database.addModel(Model.Agent, AgentModel);
	app.database.addModel(Model.Domain, DomainModel);
	app.database.addModel(Model.Intent, IntentModel);
	app.database.addModel(Model.Entity, EntityModel);
	app.database.addModel(Model.Scenario, ScenarioModel);
	app.database.addModel(Model.Users, UsersModel);
	const result = await app.database.connect();
	return result;
}

module.exports = startDatabase;
