import { Node } from "./node";

export class Context {
  config = {};
  cwd: string;
  nodes: { [id: string]: Node } = {};
  [key: string]: any;

  constructor(cwd: string) {
    this.cwd = cwd;
  }
}
