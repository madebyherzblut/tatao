declare module "marky" {
  export function mark(id: name): void;
  export function stop(name: string): Entry;
  export function getEntries(): Entry[];
}

interface Entry {
  entryType: "measure";
  startTime: number;
  duration: number;
  name: string;
}
