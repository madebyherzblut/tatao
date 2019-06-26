const { Builder, source, write, clean } = require("@tatao/core");
const { mdx } = require("@tatao/plugin-mdx");

new Builder()
  .use(clean(["./public"]))
  .use(source("./src/content/", ["/**"]))
  .use(mdx())
  .use(write("./public"))
  .run();
