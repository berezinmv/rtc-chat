/**
 * Created by berezinmv on 28.06.16.
 */

module.exports = {
  entry: "./src/client/entry.tsx",
  output: {
    filename: "app.js",
    path: "build/public/",
    publicPath: "public"
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.otf(\?[a-z0-9]+)?$/, loader: 'url-loader?limit=10000&name=[name]-[hash].[ext]' },
      { test: /\.woff(\?.+)?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2(\?.+)?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff2" },
      { test: /\.ttf(\?.+)?$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?.+)?$/, loader: "file-loader" },
      { test: /\.(svg|jpe?g|png|gif)(\?.+)?$/, loader: "file-loader" }
    ]
  },
  resolve: {
    extensions: ["", ".ts", ".js", ".tsx", ".jsx"]
  }
};
