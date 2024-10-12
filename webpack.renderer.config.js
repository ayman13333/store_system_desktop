const path = require('path');

module.exports = {
  mode: 'development',
  entry: './preload.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'preload.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: ['file-loader'],
      },
    ],
  },
};
