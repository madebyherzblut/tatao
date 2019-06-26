import * as marky from "marky";

export function timer(namespace: string) {
  return {
    start(id: string) {
      marky.mark(namespace + ":" + id);
    },

    stop(id: string) {
      marky.stop(namespace + ":" + id);
    },

    auto<T>(id: string, promise: Promise<T>): Promise<T> {
      marky.mark(namespace + ":" + id);
      return promise.finally(() => marky.stop(namespace + ":" + id));
    }
  };
}
