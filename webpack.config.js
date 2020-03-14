const CopyPlugin = require('copy-webpack-plugin');
const WorkerPlugin = require('worker-plugin');

const copyRules = [
  {
    from: __dirname + '/src/index.html',
    to: __dirname + '/dist/index.html',
  },
  {
    from: __dirname + '/src/assets',
    to: __dirname + '/dist',
  },
];

module.exports = {
  module: {
    rules: [
      {
        test: /\.w\.js$/,
        use: [
          {
            loader: 'worker-loader',
            options: {
              publicPath: process.env.ASSET_HOST || '/',
              inline: true,
            },
          },
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.js?$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [new CopyPlugin(copyRules), new WorkerPlugin()],
};
