const path = require( "path" )


const env = process.env.NODE_ENV && process.env.NODE_ENV.trim()

module.exports = {
  entry: {
    "background": "./build/sources/src/main-background.js",
    "page-action": "./build/sources/src/main-page-action.js"
  },
  output: {
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
    path: path.resolve( __dirname, "build/out" )
  },
  mode: env === "production" ? "production" : "development",
  devtool: env === "production" ? false : "inline-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
        exclude: /node_modules/
      }
    ]
  },
  node: {
    global: false
  }
}
