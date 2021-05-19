const path = require( "path" )


module.exports = {
  entry: {
    "background": "./build/sources/src/main-background.js",
    "content": "./build/sources/src/main-content.js",
    "page-action": "./build/sources/src/main-page-action.js"
  },
  output: {
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
    path: path.resolve( __dirname, "build/out" )
  },
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  devtool: process.env.NODE_ENV === "production" ? false : "inline-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
        exclude: /node_modules/
      }
    ]
  }
}
