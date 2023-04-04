const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    index: path.resolve(__dirname, 'src/js/index.js'),
    'dream-concert': path.resolve(__dirname, 'src/js/dream-concert.js'),
  },
  output: {
    path: path.resolve(__dirname, '../public/javascripts'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devtool: 'source-map',
};
