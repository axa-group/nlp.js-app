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
const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
 
class DatabaseDynamo {
  constructor() {
    AWS.config.update({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_USER_ID,
      secretAccessKey: process.env.AWS_USER_PASSWORD,
    });
    this.docClient = new AWS.DynamoDB.DocumentClient();
    this.preffix = process.env.AWS_DYNAMO_PREFFIX || '';
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.docClient = new AWS.DynamoDB.DocumentClient();
        resolve();
      } catch (error) {
        reject(new Error(error));
      }
    });
  }

  addModel(name, schema) {

  }

  getTableName(name) {
    if (name.endsWith('s')) {
      return `${this.preffix}${name}`;
    }
    return `${this.preffix}${name}s`;
  }

  findById(name, id) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: this.getTableName(name),
        KeyConditionExpression: `id=:id`,
        ExpressionAttributeValues: {
          ":id": id,
        }
      }
      this.docClient.query(params, (err, data) => {
        if (err) {
          return reject(err);
        }
        const result = data.Items[0];
        if (result) {
          result._id = result.id;
          resolve(result);
        } else {
          resolve();
        }
      });
    });
  }

  processResponse(response) {
    if (!response) {
      return undefined;
    }
    if (Array.isArray(response)) {
      return response.map(x => this.processResponse(x));
    }
    return response;
  }

  find(name, condition, projection, options) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: this.getTableName(name),
      }
      if (condition) {
        const keys = Object.keys(condition);
        if (keys.length > 0) {
          params.ExpressionAttributeValues = {};
          params.ExpressionAttributeNames = {};
          let conditionStr = '';
          for (let i = 0; i < keys.length; i += 1) {
            const key = keys[i];
            if (i > 0) {
              conditionStr += ' and ';
            }
            params.ExpressionAttributeValues[`:${key.replace('.', '_')}`] = condition[key];
            conditionStr += `#a${i}=:${key.replace('.', '_')}`;
            params.ExpressionAttributeNames[`#a${i}`] = key;
          }
          params.FilterExpression = conditionStr;
        }
      }
      this.docClient.scan(params, (err, data) => {
        if (err) {
          return reject(err);
        }
        for (let i = 0; i < data.Items.length; i += 1) {
          data.Items[i]._id = data.Items[i].id;
        }
        resolve(data.Items);
      });
    });
  }

  save(name, data) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: this.getTableName(name),
        Item: data,
      }
      if (!params.Item.id) {
        params.Item.id = uuidv4();
      }
      this.docClient.put(params, (err, data) => {
        if (err) {
          return reject(err);
        }
        const result = params.Item;
        result._id = result.id;
        resolve(result);
      });
    });
  }

  findOne(name, criteria) {
    return new Promise((resolve, reject) => {
      this.find(name, criteria)
        .then(data => {
          resolve(data[0]);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  removeById(name, id) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: this.getTableName(name),
        Key: { id: id },
      }
      this.docClient.delete(params, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }

  remove(name, condition) {
    console.log('REMOVE');
    console.log(name);
    console.log(condition);
    return new Promise((resolve, reject) => {
      this.find(name, condition)
        .then(data => {
          const promises = [];
          for (let i = 0; i < data.length; i += 1) {
            promises.push(this.removeById(name, data[i].id).bind(this));
          }
          Promise.all(promises)
            .then(data => resolve(data))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }

  saveItem(item, name) {
    console.log('SAVE ITEM');
    console.log(name);
    console.log(item);
    return this.save(name, item);
  }

  updateById(name, id, data) {
    console.log('UPDATE BY ID');
    console.log(name);
    console.log(id);
    data.id = id;
    return new Promise((resolve, reject) => {
      this.findById(name, id)
        .then(item => {
          Object.assign(item, data);
          this.save(name, item)
            .then(result => resolve(result))
            .catch(err => reject(err))
        })
        .catch(err => reject(err));
    })
  }

  deleteMany(name, condition) {
    return this.remove(name, condition);
  }
}

module.exports = DatabaseDynamo;
