import * as fs from "fs-extra";
import * as path from "path";
import { Context } from "../context";
import { Plugin } from "../plugin";

const log = require("debug")("tatao:plugin:clean");

export function clean(paths: string[]): Plugin {
  return function(context: Context) {
    const cleaners = paths.map(p => {
      log("Clean '%s'", p);
      return fs.remove(path.join(context.cwd, p));
    });
    return Promise.all(cleaners).then(() => context);
  };
}
