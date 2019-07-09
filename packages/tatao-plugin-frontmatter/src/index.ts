import { Context, logger, Node, Plugin, timer } from "@tatao/core";
import matter from "gray-matter";
import merge from "lodash/merge";

const log = logger("plugin:frontmatter");
const time = timer("plugin:frontmatter");

export function frontmatter(): Plugin {
  return function(context: Context): Promise<Context> {
    const transformers = Object.values(context.nodes).map(node => {
      if (!node.contents || !node.target || !node.target.ext.includes("mdx")) {
        return Promise.resolve(node);
      }

      log("Transform '%s'", node.id);

      return time.auto<Node>(
        node.id,
        new Promise(resolve => {
          const result = matter(node.contents as string);
          if (!(result as any).isEmpty) {
            node = merge(node, result.data);
            node.contents = result.content;
          }
          resolve(node);
        })
      );
    });

    return Promise.all(transformers).then(() => context);
  };
}
