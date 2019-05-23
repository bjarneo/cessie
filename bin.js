#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
const filePath = path.join(path.dirname(fs.realpathSync(__filename)));

require(filePath + '/index.js');