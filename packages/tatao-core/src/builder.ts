import * as marky from "marky";
import { Context } from "./context";
import { Plugin } from "./plugin";

export interface BuilderOptions {
  cwd?: string;
  locales?: string[];
}

export class Builder {
  _context: Context;
  _plugins: Plugin[] = [];

  constructor(opts: BuilderOptions = {}) {
    this._context = new Context({
      cwd: opts.cwd || process.cwd(),
      locales: opts.locales || []
    });
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
