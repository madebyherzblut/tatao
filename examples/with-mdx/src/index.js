const { Builder, source, write, clean } = require("@tatao/core");
const { mdx } = require("@tatao/plugin-mdx");
const path = require("path");

const builder = new Builder({
  cwd: path.join(__dirname, "..")
});

builder
  .use(clean(["./public"]))
  .use(source("./src/content/", ["/**"]))
  .use(mdx())
  .use(write("./public"))
  .run();
