import merge from "lodash/merge";

export interface Node {
  id: string;
  source?: string;
  target?: {
    dirname: string;
    basename: string;
    ext: string;
  };
  contents?: string;
  [key: string]: any;
}

export function create(props: Partial<Node>): Node {
  return merge(
    {
      id: "node",
      source: undefined,
      target: undefined,
      contents: undefined
    },
    props
  );
}
