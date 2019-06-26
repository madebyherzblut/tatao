import * as fs from "fs-extra";
import isEmpty from "lodash/isEmpty";
import * as path from "path";
import { Context } from "../context";
import { Node } from "../node";
import { Plugin } from "../plugin";

export function write(outputDir: string): Plugin {
  return function(context: Context) {
    const writers = Object.values(context.nodes).map((node: Node) => {
      if (isEmpty(node.contents) || isEmpty(node.target)) {
        return Promise.resolve();
      }

      const outputPath = path.join(outputDir, node.target!);
      console.log(outputPath);
      return fs.outputFile(outputPath, node.contents);
    });

    return Promise.all(writers).then(() => context);
  };
}
