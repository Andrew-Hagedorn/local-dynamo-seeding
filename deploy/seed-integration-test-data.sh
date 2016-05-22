#!/bin/bash

npm install
npm run build
node ./integration-tests/runner.js
