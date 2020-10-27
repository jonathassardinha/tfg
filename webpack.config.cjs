const path = require('path');

const config = {
  mode: 'development',
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        // use: 'ts-loader',
        use: ['cache-loader', 'awesome-typescript-loader'],
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  watchOptions: {
    poll: true,
    ignored: /node_modules/
  }

};

// export default config;
module.exports = config;