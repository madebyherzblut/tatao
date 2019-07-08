import merge from "lodash/merge";
import { Node } from "./node";

export function index(
  collection: { [id: string]: Node },
  nodes: Node[]
): { [id: string]: Node } {
  return nodes.reduce((collection, node) => {
    collection[node.id] = node;
    return collection;
  }, collection);
}

export function target(
  node: Node | undefined,
  opts: { dirname?: string; basename?: string; ext?: string }
): Node | undefined {
  if (!node || !node.target) {
    return node;
  }

  node.target = merge(node.target, opts);
  return node;
}
