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

const settings = {
  // TODO: specify this in README
  jwtSecret: process.env.JWT_SECRET || 'dummy-secret',
  scope: {
    admin: 'admin',
    collaborator: 'collaborator',
    viewer: 'viewer',
    foreign: 'foreign',
  }
};
const { scope } = settings;

settings.scopes = [scope.admin, scope.collaborator, scope.viewer];
settings.allowedScopes = [scope.admin, scope.collaborator, scope.viewer];
settings.defaultScope = scope.foreign;

settings.verb = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};

module.exports = settings;
