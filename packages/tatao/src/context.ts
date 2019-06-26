import { Node } from "./node";

export class Context {
  config = {};
  nodes: { [id: string]: Node } = {};
}
