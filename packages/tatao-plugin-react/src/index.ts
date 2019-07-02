import { transform } from "@babel/core";
import { Context, logger, Node, Plugin, timer } from "@tatao/core";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import requireFromString from "require-from-string";

const log = logger("plugin:react");
const time = timer("plugin:react");

export function react(): Plugin {
  const babelOptions = {
    presets: [
      require.resolve("@babel/preset-react"),
      [
        require.resolve("@babel/preset-env"),
        {
          targets: {
            node: "current"
          }
        }
      ]
    ]
  };

  return function(context: Context): Promise<Context> {
    const transformers = Object.values(context.nodes).map(node => {
      if (!node.contents) {
        return Promise.resolve(node);
      }

      log("Transform '%s'", node.id);

      return time.auto<Node>(
        node.id,
        new Promise((resolve, reject) => {
          transform(wrap(node.contents!), babelOptions, (err, result) => {
            if (err) {
              return reject(err);
            }

            const mod = requireFromString(result!.code!);
            const element = React.createElement(mod.default, {});
            const html = ReactDOMServer.renderToStaticMarkup(element);

            node.contents = html;
            node.target = node.target!.replace("jsx", "html");
            resolve(node);
          });
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

function wrap(code: string): string {
  return [
    `import React from ${JSON.stringify(require.resolve("react"))};`,
    `import { mdx } from ${JSON.stringify(require.resolve("@mdx-js/react"))};`,
    code
  ].join("\n");
}
