const path = require('path');

module.exports = {
  mode: 'production',
  entry: { index: path.resolve(__dirname, 'src/js/index.js') },
  output: {
    path: path.resolve(__dirname, 'public/javascripts'),
    filename: '[name].js',
  },
};
