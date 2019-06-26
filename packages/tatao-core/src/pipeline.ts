import { Context } from "./context";
import { Plugin } from "./plugin";
import * as marky from "marky";

export class Pipeline {
  plugins: Plugin[] = [];

  use(plugin: Plugin) {
    this.plugins.push(plugin);
    return this;
  }

  run(context: Context) {
    return this.plugins
      .reduce(
        (pipeline, plugin) => pipeline.then(plugin),
        Promise.resolve(context)
      )
      .then(() => {
        const summary = marky.getEntries().reduce(
          (sum, entry) => {
            sum.total += entry.duration;
            return sum;
          },
          { total: 0 }
        );

        console.log("Build time: %ds", (summary.total / 1000).toFixed(2));
      });
  }
}
