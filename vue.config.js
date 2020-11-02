const path = require("path");
const resolveResource = name => path.resolve(__dirname, "./src/theme/" + name);

module.exports = {
  lintOnSave: false,
  publicPath: process.env.PUBLIC_PATH,
  assetsDir: "static",
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [resolveResource("default.less")]
    }
  }
};
