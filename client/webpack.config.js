const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    index: path.resolve(__dirname, 'src/js/pages/index.js'),
    'dream-concert': path.resolve(__dirname, 'src/js/dream-concert/index.js'),
  },
  output: {
    path: path.resolve(__dirname, '../public/javascripts'),
    filename: '[name].min.js',
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
  resolve: {
    modules: [
      path.resolve(__dirname, 'src/js'),
      path.resolve(__dirname, 'node_modules'),
    ],
  },
};
