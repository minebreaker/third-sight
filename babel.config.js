module.exports = {
    presets: [
        ["@babel/preset-env", { targets: "last 3 Firefox versions" }]
    ],
    plugins: [
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-proposal-class-properties"
    ]
}
