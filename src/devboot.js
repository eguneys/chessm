require('./index.css');
require('./notation.css');
require('./ply.css');
require('../assets/pixel.css');

const main = require('./main');

const test = require('./test').default;
// test();

module.exports = main.app;
