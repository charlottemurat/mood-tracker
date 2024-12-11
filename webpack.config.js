const path = require('path');

module.exports = {
    entry: './src/pages/ResultsPage.js', // Your application's entry point
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.js$|jsx/, // Matches JavaScript and ES modules
          include: [
            path.resolve(__dirname, 'src'), // Your source files
            path.resolve(__dirname, 'node_modules/chart.js'), // Include Chart.js
          ],
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'], // Transpile ES6+ to compatible JS
              plugins: ['@babel/plugin-transform-class-properties'], 
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'], // Optional: Resolve .js files automatically
    },
  }; 