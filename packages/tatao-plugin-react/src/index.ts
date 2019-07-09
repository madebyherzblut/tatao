import { transform, transformSync } from "@babel/core";
import { Context, logger, Node, Nodes, Plugin, timer } from "@tatao/core";
import { addHook } from "pirates";
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

  addHook(
    code => {
      const result = transformSync(code, babelOptions);
      return result ? result.code! : code;
    },
    { exts: [".jsx"] }
  );

  return function(context: Context): Promise<Context> {
    const transformers = Object.values(context.nodes).map(node => {
      if (!node.contents || !node.target || !node.target.ext.includes("jsx")) {
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

            const mod = requireFromString(result!.code!, node.source);
            const element = React.createElement(mod.default, {});
            const html = ReactDOMServer.renderToStaticMarkup(element);

            node.contents = html;
            Nodes.target(node, { ext: "html" });
            resolve(node);
          });
        })
      );
    });

    return Promise.all(transformers).then(nodes => {
      context.nodes = Nodes.index(context.nodes, nodes);
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
