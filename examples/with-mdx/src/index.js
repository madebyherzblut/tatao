const { Context, Pipeline, source, write, debug } = require("@tatao/core");
const { mdx } = require("@tatao/plugin-mdx");

const context = new Context();
const pipeline = new Pipeline();

pipeline
  .use(source("./src/content/", ["/**"]))
  //.use(debug())
  .use(mdx())
  .use(write("./public"))
  .run(context);
