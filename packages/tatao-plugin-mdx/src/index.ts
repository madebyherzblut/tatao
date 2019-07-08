import { Plugin, Context, Node, Nodes, timer, logger } from "@tatao/core";
import transform from "@mdx-js/mdx";

const log = logger("plugin:mdx");
const time = timer("plugin:mdx");

export interface Options {}

export function mdx(_options: Options): Plugin {
  return function(context: Context): Promise<Context> {
    const transformers = Object.values(context.nodes).map(node => {
      if (!node.target || !node.target.ext.includes("mdx")) {
        return Promise.resolve(node);
      }

      log("Transform '%s'", node.id);

      return time.auto<Node>(
        node.id,
        transform(node.contents).then((jsx: string) => {
          node.contents = jsx;
          Nodes.target(node, { ext: "jsx" });
          return node;
        })
      );
    });

    return Promise.all(transformers).then(nodes => {
      context.nodes = Nodes.index(context.nodes, nodes);
      return context;
    });
  };
}
