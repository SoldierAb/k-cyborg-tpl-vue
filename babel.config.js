const plugins =
  process.env.NODE_ENV === "production"
    ? [
        [
          "kimport",
          {
            libraryName: "@cgj/k-view",
            camel2DashComponentName: true
          },
          "@cgj/k-view"
        ],
        [
          "import",
          {
            libraryName: "ant-design-vue",
            libraryDirectory: "es",
            style: "css"
          }
        ]
      ]
    : [];

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins
};
