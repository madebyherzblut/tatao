const { Context, Pipeline, source, write, clean } = require("@tatao/core");
const { mdx } = require("@tatao/plugin-mdx");
const path = require("path");

const context = new Context(path.join(__dirname, ".."));
const pipeline = new Pipeline();

pipeline
  .use(clean(["./public"]))
  .use(source("./src/content/", ["/**"]))
  .use(mdx())
  .use(write("./public"))
  .run(context);
