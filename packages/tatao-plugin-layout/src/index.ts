import { Context, logger, Node, Nodes, Plugin, timer } from "@tatao/core";

const log = logger("plugin:layout");
const time = timer("plugin:layout");

export type LayoutRenderer = (
  layoutName: string,
  node: Node,
  context: Context
) => Promise<string>;

export interface LayoutOptions {
  default?: string;
  renderer: LayoutRenderer;
}

export function layout(options: LayoutOptions): Plugin {
  const opts = Object.assign({}, { default: "default" }, options);

  return function(context: Context): Promise<Context> {
    const transformers = Object.values(context.nodes).map(node => {
      if (!node.contents || !node.target || node.target.ext !== "html") {
        return Promise.resolve(node);
      }

      const layoutName = node.layout || opts.default;

      log("Apply layout '%s' to '%s'", layoutName, node.id);
      return time.auto<Node>(
        node.id,
        opts.renderer(layoutName, node, context).then(contents => {
          node.contents = contents;
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
