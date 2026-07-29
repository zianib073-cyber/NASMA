#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const token = process.env.COD_NETWORK_TOKEN || '';
const outPath = process.argv[2] || path.join(__dirname, '..', 'cod-config.js');
const debug = process.env.COD_CONFIG_DEBUG === 'true';

const contents = debug
    ? 'window.COD_CONFIG = {\n    token: ' +
      JSON.stringify(token) +
      ',\n    debug: true\n};\n'
    : 'window.COD_CONFIG = {\n    token: ' + JSON.stringify(token) + '\n};\n';

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, contents, 'utf8');

if (!token) {
    console.warn('Warning: COD_NETWORK_TOKEN is empty — cod-config.js will not authenticate.');
} else {
    console.log('Wrote ' + outPath);
}
