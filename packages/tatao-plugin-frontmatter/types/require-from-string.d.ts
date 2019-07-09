declare module "require-from-string" {
  export default (code: string, filename?: string, options?: Options) => any;
}

interface Options {
  appendPaths: string[];
  prependPaths: string[];
}
