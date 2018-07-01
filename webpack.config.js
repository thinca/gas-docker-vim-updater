const GasPlugin = require("gas-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "Code.js",
    path: __dirname,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  mode: "development",
  devtool: false,
  plugins: [
    new GasPlugin(),
  ]
};
