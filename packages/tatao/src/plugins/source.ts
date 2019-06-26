import glob from "fast-glob";
import { Context } from "../context";
import { Plugin } from "../plugin";
import * as Node from "../node";
import * as fs from "fs-extra";
import * as path from "path";

const log = require("debug")("tatao:plugin:source");

export function source(inputDirectory: string, globs: string[]): Plugin {
  return function(context: Context) {
    inputDirectory = path.join(process.cwd(), inputDirectory);
    globs = globs.map(glob => path.join(inputDirectory, glob));

    return glob(globs)
      .then(files =>
        Promise.all(
          files.map(file => {
            const id = file.replace(inputDirectory, "");
            log("Read file '%s'", id);
            return Promise.all([fs.readFile(file), stat(file)]).then(
              ([contents, stats]) => createNode(id, file, contents, stats)
            );
          })
        )
      )
      .then(files => {
        context.nodes = files.reduce(
          (coll, node) => {
            coll[node.id] = node;
            return node;
          },
          {} as any
        );
        return context;
      });
  };
}

function createNode(
  id: string,
  file: string,
  contents: Buffer,
  stats: fs.Stats
) {
  const props = {
    date: new Date(stats.mtime)
  };

  return Node.create({ id, source: file, target: id, contents, ...props });
}

function stat(path: string): Promise<fs.Stats> {
  return new Promise((resolve, reject) => {
    fs.stat(path, function(err, stats) {
      if (err) {
        return reject(err);
      }
      resolve(stats);
    });
  });
}
