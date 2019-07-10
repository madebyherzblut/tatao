import * as fs from "fs-extra";
import isEmpty from "lodash/isEmpty";
import * as path from "path";
import { Context } from "../context";
import { Node } from "../node";
import { Plugin } from "../plugin";

const log = require("debug")("tatao:plugin:write");

export function write(outputDir: string): Plugin {
  return function(context: Context) {
    const writers = Object.values(context.nodes).map((node: Node) => {
      if (!node.target || isEmpty(node.contents) || isEmpty(node.target)) {
        log(
          "Skipping '%s' because either its contents or target is empty",
          node.id
        );
        return Promise.resolve();
      }

      const segments: string[] = [
        outputDir,
        node.locale,
        node.target.dirname,
        `${node.target.basename}.${node.target.ext}`
      ].filter(Boolean);

      log(
        "Write '%s' to '%s'",
        node.id,
        path.join(...segments).replace(outputDir, "")
      );

      return fs.outputFile(path.join(...segments), node.contents);
    });

    return Promise.all(writers).then(() => context);
  };
}
