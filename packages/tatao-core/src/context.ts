import { Node } from "./node";

export interface Options {
  cwd: string;
  locales?: string[];
}

export class Context {
  config = {};
  cwd: string;
  locales: string[] = [];
  nodes: { [id: string]: Node } = {};
  [key: string]: any;

  constructor(opts: Options) {
    this.cwd = opts.cwd;
    this.locales = opts.locales || [];
  }
}
