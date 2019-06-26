import { Node } from "./node";

export class Context {
  cwd: string;
  config = {};
  nodes: { [id: string]: Node } = {};

  constructor(cwd: string) {
    this.cwd = cwd;
  }
}
