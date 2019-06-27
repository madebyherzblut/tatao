import { Plugin, Context, Node, timer, logger } from "@tatao/core";
import transform from "@mdx-js/mdx";

const log = logger("plugin:mdx");
const time = timer("plugin:mdx");

export interface Options {}

export function mdx(_options: Options): Plugin {
  return function(context: Context): Promise<Context> {
    const transformers = Object.values(context.nodes).map(node => {
      if (!node.id.includes(".mdx")) {
        return Promise.resolve(node);
      }

      log("Transform '%s'", node.id);

      return time.auto<Node>(
        node.id,
        transform(node.contents).then((jsx: string) => {
          node.contents = jsx;
          node.target = node.target
            ? node.target.replace(".mdx", ".jsx")
            : node.target;
          return node;
        })
      );
    });

    return Promise.all(transformers).then(nodes => {
      context.nodes = nodes.reduce(
        (coll, node) => {
          coll[node.id] = node;
          return coll;
        },
        {} as any
      );

      return context;
    });
  };
}
