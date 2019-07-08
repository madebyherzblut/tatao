import * as marky from "marky";
import { Context } from "./context";
import { Plugin } from "./plugin";

export interface BuilderOptions {
  cwd?: string;
}

export class Builder {
  _context: Context;
  _plugins: Plugin[] = [];

  constructor(options: BuilderOptions = {}) {
    this._context = new Context(options.cwd || process.cwd());
  }

  use(plugin: Plugin) {
    this._plugins.push(plugin);
    return this;
  }

  run() {
    marky.mark("tatao:build");

    return this._plugins
      .reduce(
        (pipeline, plugin) => pipeline.then(plugin),
        Promise.resolve(this._context)
      )
      .then(() => {
        const marker = marky.stop("tatao:build");
        console.log("Build time: %ds", (marker.duration / 1000).toFixed(2));
      });
  }
}
