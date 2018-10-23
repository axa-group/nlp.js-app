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

const mongoose = require('mongoose');
const Joigoose = require('joigoose');

class Database {
  constructor(url) {
    this.url = url || process.env.MONGO_URL;
    mongoose.set('useFindAndModify', false);
    this.joigoose = Joigoose(mongoose);
    this.schemas = {};
    this.schemas.default = mongoose.Schema({ any: Object });
    this.modelSchemas = {};
    this.models = {};
  }

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

  addSchema(name, joiSchema) {
    this.schemas[name] = new mongoose.Schema(this.joigoose.convert(joiSchema));
  }

  getSchema(name) {
    return this.schemas[name] || this.schemas.default;
  }

  isDefault(name) {
    return this.getSchema(name) === this.schemas.default;
  }

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
