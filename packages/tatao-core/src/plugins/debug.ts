import { Context } from "../context";
import { Plugin } from "../plugin";

export function debug(): Plugin {
  return function(context: Context) {
    console.log("Nodes: ", context.nodes);
    return Promise.resolve(context);
  };
}
