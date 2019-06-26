import { Context } from "./context";
import { Plugin } from "./plugin";

export class Pipeline {
  plugins: Plugin[] = [];

  use(plugin: Plugin) {
    this.plugins.push(plugin);
    return this;
  }

  run(context: Context) {
    return this.plugins.reduce(
      (pipeline, plugin) => pipeline.then(plugin),
      Promise.resolve(context)
    );
  }
}
