const { Builder, source, write, clean } = require("@tatao/core");
const { mdx } = require("@tatao/plugin-mdx");
const { react } = require("@tatao/plugin-react");

new Builder()
  .use(clean(["./public"]))
  .use(source("./src/content/", ["/**"]))
  .use(mdx())
  .use(react())
  .use(write("./public"))
  .run();
