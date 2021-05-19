module.exports = {
    spec: "build/sources/test/**/*.js",
    require: ["source-map-support/register", "@babel/polyfill", "@babel/register"]
}
