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

const mongoose = require('mongoose');
const Joigoose = require('joigoose');

/**
 * Class for the Data Access Layer.
 */
class Database {
  /**
   * Constructor of the class.
   * @param {string} url URL to the database.
   */
  constructor(url) {
    this.url = url || process.env.MONGO_URL_URI || process.env.MONGO_URL;
    mongoose.set('useFindAndModify', false);
    this.joigoose = Joigoose(mongoose);
    this.schemas = {};
    this.schemas.default = mongoose.Schema({ any: Object });
    this.modelSchemas = {};
    this.models = {};
  }

  /**
   * Connect to the database using mongoose.
   * @returns {Promise} Promise for connecting.
   */
  connect() {
    return new Promise((resolve, reject) => {
      mongoose.connect(
        this.url,
        { useNewUrlParser: true }
      );
      const db = mongoose.connection;
      db.on('error', () => reject(new Error('Connection error')));
      db.once('open', () => resolve());
    });
  }

  /**
   * Add a mongoose schema based on the Joi schema.
   * @param {string} name Schema name.
   * @param {object} joiSchema Joi Schema.
   */
  addSchema(name, joiSchema) {
    this.schemas[name] = new mongoose.Schema(this.joigoose.convert(joiSchema));
  }

  /**
   * Gets an schema given its name.
   * @param {string} name Schema name.
   * @returns {object} Schema instance.
   */
  getSchema(name) {
    return this.schemas[name] || this.schemas.default;
  }

  /**
   * Indicates if a given schema name has the default schema.
   * @param {string} name Schema name
   * @returns {boolean} True if is the default schema, false otherwise.
   */
  isDefault(name) {
    return this.getSchema(name) === this.schemas.default;
  }

  /**
   * Add a model given the name and the schema.
   * @param {string} name Model name.
   * @param {object} schema Schema instance.
   */
  addModel(name, schema) {
    let schemaName;
    if (typeof schema === 'object') {
      schemaName = name;
      this.addSchema(schemaName, schema);
    } else {
      schemaName = schema;
    }
    this.modelSchemas[name] = this.getSchema(schemaName);
    this.models[name] = mongoose.model(name, this.modelSchemas[name]);
  }

  /**
   * Find data in the database.
   * @param {string} name Model name.
   * @param {object} condition Condition for the search.
   * @param {object} projection Projection for the search.
   * @param {object} options Options for the search.
   * @return {Promise<object[]>} Array of documents found.
   */
  find(name, condition, projection, options) {
    return new Promise((resolve, reject) => {
      const Model = this.models[name];
      if (!Model) {
        return reject(new Error(`Model not found ${name}`));
      }
      Model.find(condition || {}, projection, options, (err, docs) => {
        if (err) {
          return reject(err);
        }
        if (!docs || docs.length === 0) {
          return resolve([]);
        }
        return resolve(docs);
      });
      return undefined;
    });
  }

  /**
   * Find one document
   * @param {string} name Model name.
   * @param {object} criteria Criteria instance.
   * @returns {Promise<object>} Found document.
   */
  findOne(name, criteria) {
    return new Promise((resolve, reject) => {
      const Model = this.models[name];
      if (!Model) {
        return reject(new Error(`Model not found ${name}`));
      }
      Model.findOne(criteria, (err, doc) => {
        if (err) {
          return reject(err);
        }
        return resolve(doc);
      });
      return undefined;
    });
  }

  /**
   * Find one document by identifier.
   * @param {string} name Model name.
   * @param {string} id Unique identifier.
   * @return {Promise<object>} Document found.
   */
  findById(name, id) {
    return new Promise((resolve, reject) => {
      const Model = this.models[name];
      if (!Model) {
        return reject(new Error(`Model not found ${name}`));
      }
      Model.findById(id, (err, doc) => {
        if (err) {
          return reject(err);
        }
        return resolve(doc);
      });
      return undefined;
    });
  }

  /**
   * Delete one document by id.
   * @param {string} name Model name.
   * @param {string} id Identifier of the document.
   * @return {Promise<object>} Promise for removal.
   */
  removeById(name, id) {
    return new Promise((resolve, reject) => {
      const Model = this.models[name];
      if (!Model) {
        return reject(new Error(`Model not found ${name}`));
      }
      Model.findByIdAndRemove(id, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
      return undefined;
    });
  }

  /**
   * Remove from a collection by condition.
   * @param {string} name Model name.
   * @param {object} condition Condition.
   * @returns {Promise<object>} Promise for removal.
   */
  remove(name, condition) {
    return new Promise((resolve, reject) => {
      const Model = this.models[name];
      if (!Model) {
        return reject(new Error(`Model not found ${name}`));
      }
      Model.deleteMany(condition, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
      return undefined;
    });
  }

  /**
   * Save a document into a collection.
   * @param {string} name Model name.
   * @param {object} data Payload of the data.
   * @return {Promise<object>} Promise for saving.
   */
  save(name, data) {
    return new Promise((resolve, reject) => {
      const Model = this.models[name];
      if (!Model) {
        return reject(new Error(`Model not found ${name}`));
      }
      const item = new Model(data);
      item.save((err, value) => {
        if (err) {
          return reject(err);
        }
        return resolve(value);
      });
      return undefined;
    });
  }

  /**
   * Save content into a collection.
   * @param {object} item Item to be saved.
   * @returns {Promise<object>} Promise for saving.
   */
  saveItem(item) {
    return new Promise((resolve, reject) => {
      item.save((err, doc) => {
        if (err) {
          return reject(err);
        }
        return resolve(doc);
      });
    });
  }

  /**
   * Update a document given the identifier.
   * @param {string} name Model name.
   * @param {string} id Identifier of the document.
   * @param {object} data Data to be saved.
   * @returns {Promise<object>} Promise for updating.
   */
  updateById(name, id, data) {
    return new Promise((resolve, reject) => {
      const Model = this.models[name];
      if (!Model) {
        return reject(new Error(`Model not found ${name}`));
      }
      Model.findOneAndUpdate(
        { _id: id },
        { $set: data },
        { new: true },
        (err, doc) => {
          if (err) {
            return reject(err);
          }
          return resolve(doc);
        }
      );
      return undefined;
    });
  }

  /**
   * Delete documents given a condition.
   * @param {string} name Model name.
   * @param {object} condition Condition.
   * @returns {Promise<object>} Promise for deletion.
   */
  deleteMany(name, condition) {
    return new Promise((resolve, reject) => {
      const Model = this.models[name];
      if (!Model) {
        return reject(new Error(`Model not found ${name}`));
      }
      Model.deleteMany(condition || {}, err => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
      return undefined;
    });
  }

  /**
   * Process a response cloning it and removing non needed fields.
   * @param {object} response Response to be processed.
   * @returns {object} Processed response.
   */
  processResponse(response) {
    if (!response) {
      return undefined;
    }
    if (Array.isArray(response)) {
      return response.map(x => this.processResponse(x));
    }
    /* eslint-disable no-underscore-dangle */
    const result = Object.assign({}, response._doc ? response._doc : response);
    if (result._id) {
      result.id = result._id;
      delete result._id;
      delete result.__v;
    }
    /* eslint-enable no-underscore-dangle */
    return result;
  }
}

module.exports = Database;
