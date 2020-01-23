module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      },
      {
        test: /.glsl$/,
        use: 'ts-shader-loader'
      },
      {
        test: /\.worker\.js$/,
        loader: 'worker-loader',
        options: {
          name: 'static/[hash].worker.js',
        }
      }
    ]
  },
  output: {
    publicPath: 'dist/'
  },
  resolve: {
    extensions: [
      '.ts'
    ]
  }
};