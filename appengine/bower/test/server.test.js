/**
 * Copyright 2016, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

require(`../../../test/_setup`);

const express = require(`express`);
const path = require(`path`);
const proxyquire = require(`proxyquire`).noPreserveCache();
const request = require(`supertest`);

const SAMPLE_PATH = path.join(__dirname, `../server.js`);

function getSample () {
  const testApp = express();
  sinon.stub(testApp, `listen`).yields();
  const expressMock = sinon.stub().returns(testApp);

  const app = proxyquire(SAMPLE_PATH, {
    express: expressMock
  });
  return {
    app: app,
    mocks: {
      express: expressMock
    }
  };
}

test.beforeEach(stubConsole);
test.afterEach.always(restoreConsole);

test.cb(`should render a page`, (t) => {
  const sample = getSample();
  const expectedResult = `<h1>Hello World!</h1><p>Express.js + Bower on Google App Engine.</p>`;

  request(sample.app)
    .get(`/`)
    .expect(200)
    .expect((response) => {
      t.true(response.text.includes(expectedResult));
    })
    .end(t.end);
});
