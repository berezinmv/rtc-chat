/**
 * Created by berezinmv on 28.06.16.
 */

module.exports = {
  entry: "./src/client/entry.ts",
  output: {
    filename: "app.js",
    path: "build/public/",
    publicPath: "public"
  },
  devtool: "eval",
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: ["", ".ts", ".js"]
  }
};
